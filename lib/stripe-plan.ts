
export interface Plan {
    id: number;
    name: string;
    priceId: string;
    price: number;
    limits: {
        projects: number;
        storage: number;
    }
}
// Can put this inside DB
export const plans: Plan[] = [
    {
        id: 1,// custom field
        name: "pro", // the name of the plan, it'll be automatically lower cased when stored in the database
        priceId: "price_1RYUz4QaJIIVu8TuRk4LRB8D", // the price ID from stripe
        price: 20.00,
        limits: {
            projects: 5,
            storage: 10
        }
    },
    {
        id: 2,// custom field
        name: "pro+", // the name of the plan, it'll be automatically lower cased when stored in the database
        priceId: "price_1RYbOtQaJIIVu8Tu1S72VbdG", // the price ID from stripe
        price: 49.99,
        limits: {
            projects: 200,
            storage: 100
        }
    }

]


