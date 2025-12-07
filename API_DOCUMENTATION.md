# NoFatCommunity API Documentation

Документация API для iOS приложения NoFatCommunity.

## Базовая информация

- **Base URL**: `http://localhost:8028` (локальная разработка)
- **Production URL**: будет указан позже
- **Content-Type**: `application/json`
- **Кодировка**: UTF-8

## Аутентификация

API использует **Bearer Token** аутентификацию через сессионные токены.

### Процесс авторизации

1. **Инициирование OAuth через Google**
   - Откройте в браузере/WebView: `GET /auth/google`
   - Пользователь авторизуется через Google
   - Происходит редирект на `/auth/callback`

2. **Получение токена**
   - После успешной авторизации, callback возвращает токен:
   ```json
   {
     "token": "550e8400-e29b-41d4-a716-446655440000",
     "name": "Иван Иванов"
   }
   ```

3. **Использование токена**
   - Сохраните токен на устройстве
   - Добавляйте его в заголовок всех приватных запросов:
   ```
   Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000
   ```

### Режим разработки

Если `APP_ENV=dev`, авторизация пропускается автоматически. Для тестирования можно использовать фиктивный UUID.

---

## Публичные эндпоинты

### 1. Получить лидерборд

Получает топ-25 пользователей по проценту снижения веса за последние 30 дней.

**Endpoint:** `GET /leaderboard`

**Авторизация:** Не требуется

**Response 200:**
```json
[
  {
    "rank": 1,
    "username": "Иван Иванов",
    "lost_percent": 12.5
  },
  {
    "rank": 2,
    "username": "Мария Петрова",
    "lost_percent": 10.3
  }
]
```

**Response 500:**
```json
{
  "error": "internal server error"
}
```

**Примечания:**
- Возвращает только пользователей с положительным процентом потери веса
- Процент вычисляется как: `((начальный_вес - текущий_вес) / начальный_вес) * 100`
- Данные берутся за последние 30 дней

---

## Приватные эндпоинты (требуют авторизации)

Все приватные эндпоинты требуют заголовок:
```
Authorization: Bearer <token>
```

### 2. Создать/обновить профиль пользователя

Создает или обновляет анкетные данные пользователя и фиксирует начальный вес.

**Endpoint:** `POST /users/me`

**Авторизация:** Требуется

**Request Body:**
```json
{
  "height_cm": 175,
  "weight": 80.5,
  "age": 30,
  "gender": 1,
  "goal_weight": 70.0
}
```

**Поля:**
- `height_cm` (int, обязательное) - рост в сантиметрах, > 0
- `weight` (float, обязательное) - текущий вес в кг, > 0
- `age` (int, обязательное) - возраст, > 0
- `gender` (int, обязательное) - пол (1 = мужской, 2 = женский), > 0
- `goal_weight` (float, обязательное) - целевой вес в кг, > 0

**Response 200:**
```json
{
  "status": "ok",
  "height_cm": 175,
  "weight": 80.5,
  "age": 30,
  "gender": 1,
  "goal_weight": 70.0,
  "updated_at": "2024-06-15T10:30:00Z"
}
```

**Response 400:**
```json
{
  "error": "All fields must be greater than 0"
}
```

**Response 401:**
```json
{
  "error": "Unauthorized"
}
```

**Response 404:**
```
User not found
```

**Response 500:**
```
Database error
```

**Примечания:**
- При создании профиля вес автоматически фиксируется в `weight_logs` за текущий день
- Если запись за сегодня уже существует, она не перезаписывается

---

### 3. Обновить вес на сегодня

Записывает вес пользователя за текущую дату.

**Endpoint:** `PUT /users/me/weight`

**Авторизация:** Требуется

**Request Body:**
```json
{
  "weight": 79.8
}
```

**Поля:**
- `weight` (float, обязательное) - вес в кг, > 0

**Response 200:**
```json
{
  "status": "ok",
  "weight": 79.8,
  "date": "2024-06-15"
}
```

**Response 400:**
```json
{
  "error": "Weight for today has already been recorded"
}
```

или

```json
{
  "error": "Вес должен быть в диапазоне ±3% от предыдущего значения."
}
```

**Response 401:**
```json
{
  "error": "Unauthorized"
}
```

**Response 500:**
```json
{
  "error": "Database error"
}
```

**Ограничения:**
- Можно записать вес только один раз в день
- Новый вес должен быть в диапазоне ±3% от предыдущего значения
- Если это первая запись веса, ограничение ±3% не применяется

**Пример расчета ±3%:**
- Предыдущий вес: 80.0 кг
- Минимум: 80.0 × 0.97 = 77.6 кг
- Максимум: 80.0 × 1.03 = 82.4 кг
- Новый вес должен быть в диапазоне [77.6, 82.4]

---

### 4. Получить историю веса

Возвращает последние 30 записей веса пользователя.

**Endpoint:** `GET /users/me/weights`

**Авторизация:** Требуется

**Response 200:**
```json
[
  {
    "date": "2024-06-01",
    "weight": 81.2
  },
  {
    "date": "2024-06-02",
    "weight": 80.8
  },
  {
    "date": "2024-06-03",
    "weight": 80.5
  }
]
```

**Response 500:**
```json
{
  "error": "Database error"
}
```

**Примечания:**
- Возвращает максимум 30 последних записей
- Записи отсортированы от старых к новым (хронологический порядок)
- Формат даты: `YYYY-MM-DD`
- Если записей нет, возвращается пустой массив `[]`

---

## Коды HTTP статусов

| Код | Описание |
|-----|----------|
| 200 | Успешный запрос |
| 400 | Неверный запрос (валидация, бизнес-логика) |
| 401 | Не авторизован (отсутствует или невалидный токен) |
| 404 | Ресурс не найден |
| 500 | Внутренняя ошибка сервера |

---

## Типы данных

### ErrorResponse
```swift
struct ErrorResponse: Codable {
    let error: String
}
```

### CreateProfileRequest
```swift
struct CreateProfileRequest: Codable {
    let heightCm: Int
    let weight: Double
    let age: Int
    let gender: Int
    let goalWeight: Double
    
    enum CodingKeys: String, CodingKey {
        case heightCm = "height_cm"
        case weight
        case age
        case gender
        case goalWeight = "goal_weight"
    }
}
```

### CreateProfileResponse
```swift
struct CreateProfileResponse: Codable {
    let status: String
    let heightCm: Int
    let weight: Double
    let age: Int
    let gender: Int
    let goalWeight: Double
    let updatedAt: Date
    
    enum CodingKeys: String, CodingKey {
        case status
        case heightCm = "height_cm"
        case weight
        case age
        case gender
        case goalWeight = "goal_weight"
        case updatedAt = "updated_at"
    }
}
```

### UpdateWeightRequest
```swift
struct UpdateWeightRequest: Codable {
    let weight: Double
}
```

### UpdateWeightResponse
```swift
struct UpdateWeightResponse: Codable {
    let status: String
    let weight: Double
    let date: String  // "YYYY-MM-DD"
}
```

### WeightEntry
```swift
struct WeightEntry: Codable {
    let date: String  // "YYYY-MM-DD"
    let weight: Double
}
```

### LeaderboardEntry
```swift
struct LeaderboardEntry: Codable {
    let rank: Int
    let username: String
    let lostPercent: Double
    
    enum CodingKeys: String, CodingKey {
        case rank
        case username
        case lostPercent = "lost_percent"
    }
}
```

### AuthResponse
```swift
struct AuthResponse: Codable {
    let token: String
    let name: String
}
```

---

## Примеры использования

### Swift/SwiftUI пример

```swift
import Foundation

class APIClient {
    static let shared = APIClient()
    private let baseURL = "http://localhost:8028"
    private var token: String?
    
    private init() {}
    
    func setToken(_ token: String) {
        self.token = token
    }
    
    // MARK: - Auth
    
    func startGoogleAuth() -> URL? {
        return URL(string: "\(baseURL)/auth/google")
    }
    
    // MARK: - Profile
    
    func createProfile(_ request: CreateProfileRequest) async throws -> CreateProfileResponse {
        return try await request(
            endpoint: "/users/me",
            method: "POST",
            body: request
        )
    }
    
    // MARK: - Weight
    
    func updateWeight(_ weight: Double) async throws -> UpdateWeightResponse {
        let request = UpdateWeightRequest(weight: weight)
        return try await request(
            endpoint: "/users/me/weight",
            method: "PUT",
            body: request
        )
    }
    
    func getWeightHistory() async throws -> [WeightEntry] {
        return try await request(
            endpoint: "/users/me/weights",
            method: "GET"
        )
    }
    
    // MARK: - Leaderboard
    
    func getLeaderboard() async throws -> [LeaderboardEntry] {
        return try await request(
            endpoint: "/leaderboard",
            method: "GET",
            requiresAuth: false
        )
    }
    
    // MARK: - Helper
    
    private func request<T: Codable, U: Codable>(
        endpoint: String,
        method: String,
        body: T? = nil,
        requiresAuth: Bool = true
    ) async throws -> U {
        guard let url = URL(string: "\(baseURL)\(endpoint)") else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if requiresAuth {
            guard let token = token else {
                throw APIError.unauthorized
            }
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        if httpResponse.statusCode == 401 {
            throw APIError.unauthorized
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            if let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data) {
                throw APIError.serverError(errorResponse.error)
            }
            throw APIError.serverError("Unknown error")
        }
        
        return try JSONDecoder().decode(U.self, from: data)
    }
}

enum APIError: Error {
    case invalidURL
    case unauthorized
    case invalidResponse
    case serverError(String)
}
```

---

## Важные замечания для iOS разработки

### 1. Формат дат
- API возвращает даты в формате `YYYY-MM-DD` (например, "2024-06-15")
- Используйте `DateFormatter` для парсинга:
  ```swift
  let formatter = DateFormatter()
  formatter.dateFormat = "yyyy-MM-dd"
  let date = formatter.date(from: "2024-06-15")
  ```

### 2. Хранение токена
- Сохраняйте токен в Keychain для безопасности
- Используйте UserDefaults только для режима разработки

### 3. Обработка ошибок
- Всегда проверяйте статус код ответа
- Обрабатывайте случай, когда токен истек (401) и запрашивайте повторную авторизацию
- Показывайте пользователю понятные сообщения об ошибках

### 4. Валидация данных
- Проверяйте входные данные перед отправкой на сервер
- Соблюдайте ограничения ±3% для обновления веса

### 5. CORS
- Сервер настроен для работы с CORS, можно делать запросы из iOS приложения

### 6. WebView для OAuth
- Используйте `WKWebView` для авторизации через Google
- Перехватывайте редирект на `/auth/callback` и извлекайте токен

---

## Swagger документация

Интерактивная Swagger документация доступна по адресу:
- **Локально**: `http://localhost:8028/swagger/index.html`

Здесь можно протестировать все эндпоинты в браузере.

---

## Поддержка

При возникновении вопросов или проблем обращайтесь к бэкенд разработчику.

**Версия API:** 1.0  
**Последнее обновление:** 2024-06-15

