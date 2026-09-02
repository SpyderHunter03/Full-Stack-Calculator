using Calculator.Api.Controllers;
using Calculator.Api.Models;
using Calculator.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Calculator.Api.Tests;

public sealed class CalculatorControllerTests
{
    [Fact]
    public void GetAll_returns_ok_with_stored_calculations()
    {
        var store = new InMemoryCalculationStore();
        var expected = new CalculationResult(Guid.NewGuid(), 5, "2 + 3", DateTimeOffset.UtcNow);
        store.Add(expected);
        var controller = new CalculatorController(new StubCalculator(expected), store);

        var result = controller.GetAll();

        var response = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(new[] { expected }, response.Value);
    }

    [Fact]
    public void Calculate_returns_ok_with_calculation_result()
    {
        var expected = new CalculationResult(Guid.NewGuid(), 5, "2 + 3", DateTimeOffset.UtcNow);
        var controller = new CalculatorController(new StubCalculator(expected), new InMemoryCalculationStore());

        var result = controller.Calculate(new CalculationRequest(2, 3, "+"));

        var response = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(expected, response.Value);
    }

    [Fact]
    public void Calculate_returns_bad_request_when_the_calculator_rejects_the_request()
    {
        var controller = new CalculatorController(new ThrowingCalculator(), new InMemoryCalculationStore());

        var result = controller.Calculate(new CalculationRequest(2, 3, "^"));

        var response = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(response.Value);
    }

    [Fact]
    public void Calculate_returns_the_division_by_zero_message()
    {
        var controller = new CalculatorController(new DivideByZeroCalculator(), new InMemoryCalculationStore());

        var result = controller.Calculate(new CalculationRequest(2, 0, "/"));

        var response = Assert.IsType<BadRequestObjectResult>(result.Result);
        var error = Assert.IsType<string>(response.Value?.GetType().GetProperty("error")?.GetValue(response.Value));
        Assert.Equal("Cannot divide by zero.", error);
    }

    [Fact]
    public void Clear_with_an_id_deletes_one_calculation_and_returns_ok()
    {
        var store = new InMemoryCalculationStore();
        var id = Guid.NewGuid();
        store.Add(new CalculationResult(id, 5, "2 + 3", DateTimeOffset.UtcNow));
        var controller = new CalculatorController(new StubCalculator(), store);

        var result = controller.Clear(id);

        Assert.IsType<OkResult>(result);
        Assert.Empty(store.GetAll());
    }

    [Fact]
    public void Clear_without_an_id_deletes_all_calculations_and_returns_ok()
    {
        var store = new InMemoryCalculationStore();
        store.Add(new CalculationResult(Guid.NewGuid(), 5, "2 + 3", DateTimeOffset.UtcNow));
        var controller = new CalculatorController(new StubCalculator(), store);

        var result = controller.Clear(null);

        Assert.IsType<OkResult>(result);
        Assert.Empty(store.GetAll());
    }

    private sealed class StubCalculator(CalculationResult? result = null) : ICalculator
    {
        public CalculationResult Calculate(CalculationRequest request) =>
            result ?? new CalculationResult(Guid.NewGuid(), 0, "0", DateTimeOffset.UtcNow);
    }

    private sealed class ThrowingCalculator : ICalculator
    {
        public CalculationResult Calculate(CalculationRequest request) =>
            throw new ArgumentException("Unsupported operation.");
    }

    private sealed class DivideByZeroCalculator : ICalculator
    {
        public CalculationResult Calculate(CalculationRequest request) =>
            throw new DivideByZeroException("Cannot divide by zero.");
    }
}