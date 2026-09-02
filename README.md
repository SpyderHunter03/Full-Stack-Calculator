# Full-Stack Calculator

A full-stack calculator built with React, ASP.NET Core, and an in-memory calculation store.

## Structure

- `client/`: React + TypeScript UI, with Vitest and Testing Library tests.
- `src/Calculator.Api/`: ASP.NET Core API and application services.
- `tests/Calculator.Api.Tests/`: xUnit unit tests for the API.

## Run locally

```powershell
dotnet run --project src/Calculator.Api
cd client
npm install
npm run dev
```

The API is available at the URL printed by .NET. The Vite client runs at `http://localhost:5173`.

## Test-driven workflow

Every feature follows Red-Green-Refactor:

1. Add a focused failing test in the nearest test project.
2. Implement the smallest change that makes it pass.
3. Refactor while keeping the test suite green.

Run the suites with:

```powershell
dotnet test FullStackCalculator.slnx
cd client
npm test
npm run build
```

The current slice establishes the calculator contract, in-memory persistence boundary, API controller, and frontend test harness. Arithmetic behavior and API integration will be expanded one tested behavior at a time.
