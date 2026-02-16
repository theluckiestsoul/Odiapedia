import { dag, Container, Directory, object, func, connection } from "@dagger.io/dagger"

async function main() {
    await connection(async () => {
        // Get source directory from host
        const source = dag.host().directory(".", { exclude: ["node_modules", "dagger", ".next"] })

        // Start with a Node.js container for Playwright
        // We use the official Playwright image which has browsers pre-installed
        const ctr = dag
            .container()
            .from("mcr.microsoft.com/playwright:v1.45.0-jammy")
            .withDirectory("/app", source)
            .withWorkdir("/app")
            // Install dependencies
            .withExec(["npm", "ci"])
            // Run tests
            .withExec(["npx", "playwright", "test"])

        // Execute and print output
        const result = await ctr.stdout()
        console.log(result)
    })
}

main()
