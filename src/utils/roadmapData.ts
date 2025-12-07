// Get color based on calories
export const getCalorieColor = (calories: number): string => {
  if (calories < 300) {
    return '#6FCF97'; // Green - меньше всего
  } else if (calories < 450) {
    return '#219653'; // Темно-зеленый - чуть больше
  } else if (calories < 600) {
    return '#FFA726'; // Желтый/оранжевый - чуть больше
  } else {
    return '#EF5350'; // Красный - больше всех
  }
};

// Get meal prep instructions for 4 days
export const getMealPrepInstructions4Days = () => {
  return {
    totalTime: '3 hours',
    steps: [
      {
        title: 'Prepare Proteins',
        time: '50 minutes',
        instructions: [
          'Season 2 lbs chicken breast with salt, pepper, and herbs',
          'Bake at 375°F for 25-30 minutes until internal temperature reaches 165°F',
          'While chicken cooks, season 1.5 lbs salmon fillet',
          'Bake salmon at 400°F for 12-15 minutes',
          'Let proteins cool before portioning',
        ],
      },
      {
        title: 'Cook Grains',
        time: '35 minutes',
        instructions: [
          'Rinse 1 cup quinoa and 1 cup brown rice separately',
          'Cook quinoa with 2 cups water for 15 minutes',
          'Cook brown rice with 2 cups water for 20 minutes',
          'Bake 2 lbs sweet potatoes at 400°F for 35 minutes',
          'Let all grains cool completely',
        ],
      },
      {
        title: 'Prepare Vegetables',
        time: '50 minutes',
        instructions: [
          'Wash and chop all vegetables (spinach, broccoli, bell peppers, carrots, cucumber)',
          'Steam broccoli for 5-7 minutes until tender-crisp',
          'Roast bell peppers at 400°F for 20 minutes',
          'Roast carrots at 400°F for 25 minutes',
          'Store raw and cooked vegetables in separate airtight containers',
        ],
      },
      {
        title: 'Portion Meals',
        time: '45 minutes',
        instructions: [
          'Divide proteins into 8 equal portions (4 days × 2 meals)',
          'Portion grains into containers',
          'Add vegetables to each container',
          'Label containers with dates (Day 4, Day 5, Day 6, Day 7)',
          'Store in refrigerator',
        ],
      },
    ],
  };
};

// Get meal prep instructions based on days
export const getMealPrepInstructions = (days: number) => {
  if (days === 3) {
    return {
      totalTime: '2 hours 30 minutes',
      steps: [
        {
          title: 'Prepare Proteins',
          time: '45 minutes',
          instructions: [
            'Season 2 lbs chicken breast with salt, pepper, and herbs',
            'Bake at 375°F for 25-30 minutes until internal temperature reaches 165°F',
            'While chicken cooks, season 1.5 lbs salmon fillet',
            'Bake salmon at 400°F for 12-15 minutes',
            'Let proteins cool before portioning',
          ],
        },
        {
          title: 'Cook Grains',
          time: '30 minutes',
          instructions: [
            'Rinse 1 cup quinoa and 1 cup brown rice separately',
            'Cook quinoa with 2 cups water for 15 minutes',
            'Cook brown rice with 2 cups water for 20 minutes',
            'Let grains cool completely',
          ],
        },
        {
          title: 'Prepare Vegetables',
          time: '40 minutes',
          instructions: [
            'Wash and chop all vegetables (spinach, broccoli, bell peppers, carrots, cucumber)',
            'Steam broccoli for 5-7 minutes until tender-crisp',
            'Roast bell peppers at 400°F for 20 minutes',
            'Store raw vegetables in airtight containers',
          ],
        },
        {
          title: 'Portion Meals',
          time: '35 minutes',
          instructions: [
            'Divide proteins into 6 equal portions (3 days × 2 meals)',
            'Portion grains into containers',
            'Add vegetables to each container',
            'Label containers with dates (Day 1, Day 2, Day 3)',
            'Store in refrigerator',
          ],
        },
      ],
    };
  } else {
    return {
      totalTime: '4 hours 15 minutes',
      steps: [
        {
          title: 'Prepare Proteins',
          time: '1 hour 15 minutes',
          instructions: [
            'Season 2 lbs chicken breast with salt, pepper, and herbs',
            'Bake at 375°F for 25-30 minutes until internal temperature reaches 165°F',
            'While chicken cooks, season 1.5 lbs salmon fillet',
            'Bake salmon at 400°F for 12-15 minutes',
            'Hard boil 12 eggs (10 minutes boiling, then ice bath)',
            'Let all proteins cool before portioning',
          ],
        },
        {
          title: 'Cook Grains',
          time: '45 minutes',
          instructions: [
            'Rinse 1 cup quinoa and 1 cup brown rice separately',
            'Cook quinoa with 2 cups water for 15 minutes',
            'Cook brown rice with 2 cups water for 20 minutes',
            'Bake 3 lbs sweet potatoes at 400°F for 40 minutes',
            'Let all grains cool completely',
          ],
        },
        {
          title: 'Prepare Vegetables',
          time: '1 hour',
          instructions: [
            'Wash and chop all vegetables (spinach, broccoli, bell peppers, carrots, cucumber)',
            'Steam broccoli for 5-7 minutes until tender-crisp',
            'Roast bell peppers at 400°F for 20 minutes',
            'Roast carrots at 400°F for 25 minutes',
            'Store raw and cooked vegetables in separate airtight containers',
          ],
        },
        {
          title: 'Prepare Fruits and Snacks',
          time: '30 minutes',
          instructions: [
            'Wash and portion berries into containers',
            'Slice bananas and store with lemon juice to prevent browning',
            'Portion almonds into 7 snack bags',
            'Prepare Greek yogurt portions',
          ],
        },
        {
          title: 'Portion Meals',
          time: '1 hour 5 minutes',
          instructions: [
            'Divide proteins into 14 equal portions (7 days × 2 meals)',
            'Portion grains into containers',
            'Add vegetables to each container',
            'Label containers with dates (Day 1 through Day 7)',
            'Organize by day in refrigerator',
            'Store fruits and snacks separately',
          ],
        },
      ],
    };
  }
};

// Get products for meal prep
export const getProductsForWeek = (replacedProducts: Record<string, Record<number, { name: string; amount: string }>> = {}) => {
  const baseProducts = {
    proteins: [
      { name: 'Chicken Breast', amount: '2 lbs', canReplace: true },
      { name: 'Salmon Fillet', amount: '1.5 lbs', canReplace: true },
      { name: 'Greek Yogurt', amount: '32 oz', canReplace: true },
      { name: 'Eggs', amount: '12 pieces', canReplace: true },
    ],
    vegetables: [
      { name: 'Spinach', amount: '1 bag', canReplace: true },
      { name: 'Broccoli', amount: '2 lbs', canReplace: true },
      { name: 'Bell Peppers', amount: '4 pieces', canReplace: true },
      { name: 'Carrots', amount: '1 lb', canReplace: true },
      { name: 'Cucumber', amount: '2 pieces', canReplace: true },
    ],
    carbs: [
      { name: 'Quinoa', amount: '1 lb', canReplace: true },
      { name: 'Brown Rice', amount: '1 lb', canReplace: true },
      { name: 'Sweet Potatoes', amount: '3 lbs', canReplace: true },
      { name: 'Oats', amount: '16 oz', canReplace: true },
    ],
    fruits: [
      { name: 'Berries Mix', amount: '2 lbs', canReplace: true },
      { name: 'Bananas', amount: '6 pieces', canReplace: true },
      { name: 'Apples', amount: '4 pieces', canReplace: true },
    ],
    other: [
      { name: 'Almonds', amount: '8 oz', canReplace: true },
      { name: 'Olive Oil', amount: '16 oz', canReplace: true },
      { name: 'Honey', amount: '12 oz', canReplace: true },
    ],
  };

  // Apply replaced products
  const result: any = {};
  Object.keys(baseProducts).forEach((category) => {
    result[category] = baseProducts[category as keyof typeof baseProducts].map((product, index) => {
      const replaced = replacedProducts[category]?.[index];
      if (replaced) {
        return {
          ...product,
          name: replaced.name,
          amount: replaced.amount,
        };
      }
      return product;
    });
  });
  return result;
};

// Get alternative products for replacement
export const getAlternativeProducts = (category: string, currentProductName: string) => {
  const alternatives: Record<string, Array<{ name: string; amount: string }>> = {
    proteins: [
      { name: 'Turkey Breast', amount: '2 lbs' },
      { name: 'Tofu', amount: '1.5 lbs' },
      { name: 'Lean Ground Beef', amount: '2 lbs' },
      { name: 'Tuna Steak', amount: '1.5 lbs' },
      { name: 'Chicken Thighs', amount: '2 lbs' },
      { name: 'Pork Tenderloin', amount: '1.5 lbs' },
    ],
    vegetables: [
      { name: 'Kale', amount: '1 bag' },
      { name: 'Zucchini', amount: '2 lbs' },
      { name: 'Cauliflower', amount: '2 lbs' },
      { name: 'Asparagus', amount: '1 lb' },
      { name: 'Green Beans', amount: '1 lb' },
      { name: 'Tomatoes', amount: '4 pieces' },
    ],
    carbs: [
      { name: 'White Rice', amount: '1 lb' },
      { name: 'Barley', amount: '1 lb' },
      { name: 'Buckwheat', amount: '1 lb' },
      { name: 'Whole Wheat Pasta', amount: '1 lb' },
      { name: 'Lentils', amount: '1 lb' },
      { name: 'Black Beans', amount: '1 lb' },
    ],
    fruits: [
      { name: 'Oranges', amount: '6 pieces' },
      { name: 'Grapes', amount: '2 lbs' },
      { name: 'Pears', amount: '4 pieces' },
      { name: 'Peaches', amount: '6 pieces' },
      { name: 'Mango', amount: '3 pieces' },
    ],
    other: [
      { name: 'Walnuts', amount: '8 oz' },
      { name: 'Cashews', amount: '8 oz' },
      { name: 'Coconut Oil', amount: '16 oz' },
      { name: 'Maple Syrup', amount: '12 oz' },
      { name: 'Peanut Butter', amount: '12 oz' },
    ],
  };

  return alternatives[category]?.filter(product => product.name !== currentProductName) || [];
};

// Get alternative meals for replacement
export const getAlternativeMeals = (mealType: string) => {
  if (mealType === 'Breakfast') {
    return [
      {
        dish: 'Greek yogurt with granola and fruits',
        calories: 320,
        protein: 15,
        carbs: 45,
        fat: 8,
        fiber: 5,
        ingredients: ['Greek Yogurt', 'Granola', 'Mixed Berries'],
        instructions: ['Pour yogurt into a bowl', 'Top with granola and fresh berries'],
      },
      {
        dish: 'Scrambled eggs with whole grain toast',
        calories: 350,
        protein: 20,
        carbs: 30,
        fat: 15,
        fiber: 4,
        ingredients: ['2 Eggs', 'Milk', 'Salt', 'Black Pepper', 'Whole Grain Bread'],
        instructions: ['Whisk eggs with milk, salt, and pepper', 'Cook in a non-stick pan over medium heat', 'Toast the bread and serve alongside'],
      },
      {
        dish: 'Smoothie bowl with chia seeds',
        calories: 290,
        protein: 10,
        carbs: 50,
        fat: 5,
        fiber: 8,
        ingredients: ['Frozen Berries', 'Banana', 'Almond Milk', 'Chia Seeds'],
        instructions: ['Blend berries, banana, and almond milk until smooth', 'Pour into a bowl', 'Sprinkle with chia seeds'],
      },
      {
        dish: 'Avocado toast with poached egg',
        calories: 380,
        protein: 18,
        carbs: 35,
        fat: 20,
        fiber: 6,
        ingredients: ['Whole Grain Bread', 'Avocado', 'Egg', 'Red Chili Flakes'],
        instructions: ['Toast the bread', 'Mash avocado and spread on toast', 'Poach the egg and place on top', 'Sprinkle with chili flakes'],
      },
      {
        dish: 'Protein pancakes with berries',
        calories: 340,
        protein: 22,
        carbs: 40,
        fat: 10,
        fiber: 5,
        ingredients: ['Protein Powder', 'Rolled Oats', 'Egg Whites', 'Almond Milk', 'Fresh Berries'],
        instructions: ['Blend oats, protein powder, egg whites, and milk', 'Cook pancakes on a heated griddle', 'Serve topped with fresh berries'],
      },
    ];
  }
  return [];
};

// Mock meal data for each day
export const getMealsForDay = (day: number) => {
  const meals = [
    {
      time: '8:00 AM',
      type: 'Breakfast',
      dish: 'Oatmeal with berries and honey',
      calories: 280,
    },
    {
      time: '12:30 PM',
      type: 'Lunch',
      dish: 'Grilled chicken salad with quinoa',
      calories: 520,
    },
    {
      time: '3:00 PM',
      type: 'Snack',
      dish: 'Greek yogurt with almonds',
      calories: 180,
    },
    {
      time: '7:00 PM',
      type: 'Dinner',
      dish: 'Baked salmon with vegetables',
      calories: 650,
    },
  ];
  return meals.map(meal => ({
    ...meal,
    color: getCalorieColor(meal.calories),
  }));
};

