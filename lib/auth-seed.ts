'use server'
import { auth } from "@/lib/auth";

const users = [
    {
        name: 'User',
        email: 'user@nextmail.com',
        password: 'admin1234',
    },
];


async function main() {
    try {
        for (const user of users) {
            await auth.api.signUpEmail({
                body: {
                    email: user.email,
                    password: user.password,
                    name: user.name,
                    callbackURL: "",
                },
            });
        }
    } catch (error: unknown) {
        console.error("❌ Error to create user :", error);
        return;
    }

    console.log("✅ User has been created.");
}

main();