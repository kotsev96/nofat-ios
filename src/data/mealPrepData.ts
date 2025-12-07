import { MealPrepStep } from '../components/StepCard';

export interface MealPrepInstructions {
    totalTime: string;
    steps: MealPrepStep[];
}

/**
 * Meal prep instructions for 3 days (7 days total)
 */
const mealPrepInstructions3Days: MealPrepInstructions = {
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

/**
 * Meal prep instructions for 4 days
 */
const mealPrepInstructions4Days: MealPrepInstructions = {
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

/**
 * Get meal prep instructions based on number of days
 */
export const getMealPrepInstructions = (days: number | '3-4'): MealPrepInstructions => {
    if (days === 3) {
        return mealPrepInstructions3Days;
    }
    // Default fallback
    return {
        totalTime: '2 hours 30 minutes',
        steps: [],
    };
};

/**
 * Get meal prep instructions for 4 days
 */
export const getMealPrepInstructions4Days = (): MealPrepInstructions => {
    return mealPrepInstructions4Days;
};
