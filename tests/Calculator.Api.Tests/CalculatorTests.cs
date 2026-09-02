using Calculator.Api.Models;
using Calculator.Api.Services;

namespace Calculator.Api.Tests;

public sealed class CalculatorTests
{
    public static TheoryData<string, decimal> SupportedOperations => new()
    {
        { "+", 5 },
        { "-", -1 },
        { "*", 6 },
        { "/", 0.6666666666666666666666666667m },
        { "%", 2 }
    };

    [Fact]
    public void Calculate_Adds_two_numbers_and_stores_the_result()
    {
        var store = new InMemoryCalculationStore();
        var calculator = new Calculator.Api.Services.Calculator(store, new DateTimeService());

        var result = calculator.Calculate(new CalculationRequest(2, 3, "+"));

        Assert.Equal(5, result.Value);
        Assert.Equal("2 + 3", result.Expression);
        Assert.Single(store.GetAll());
    }

    [Theory]
    [MemberData(nameof(SupportedOperations))]
    public void Calculate_returns_the_expected_result_for_each_supported_operator(string operation, decimal expected)
    {
        var calculator = new Calculator.Api.Services.Calculator(
            new InMemoryCalculationStore(),
            new FixedDateTimeService());

        var result = calculator.Calculate(new CalculationRequest(2, 3, operation));

        Assert.Equal(expected, result.Value);
    }

    [Fact]
    public void Calculate_uses_the_time_service_and_stores_the_full_expression()
    {
        var store = new InMemoryCalculationStore();
        var createdAt = new DateTimeOffset(2026, 9, 2, 12, 30, 0, TimeSpan.Zero);
        var calculator = new Calculator.Api.Services.Calculator(
            store,
            new FixedDateTimeService(createdAt));

        var result = calculator.Calculate(new CalculationRequest(12.5m, 2, "/"));

        Assert.Equal("12.5 / 2", result.Expression);
        Assert.Equal(createdAt, result.CreatedAt);
        Assert.Contains(result, store.GetAll());
    }

    [Theory]
    [InlineData("^")]
    public void Calculate_throws_for_unsupported_operations(string operation)
    {
        var calculator = new Calculator.Api.Services.Calculator(
            new InMemoryCalculationStore(),
            new FixedDateTimeService());

        Assert.Throws<ArgumentException>(() =>
            calculator.Calculate(new CalculationRequest(2, operation == "/" ? 0 : 3, operation)));
    }

    [Fact]
    public void Calculate_throws_a_specific_error_for_division_by_zero()
    {
        var calculator = new Calculator.Api.Services.Calculator(
            new InMemoryCalculationStore(),
            new FixedDateTimeService());

        var exception = Assert.Throws<DivideByZeroException>(() =>
            calculator.Calculate(new CalculationRequest(2, 0, "/")));

        Assert.Equal("Cannot divide by zero.", exception.Message);
    }

    private sealed class FixedDateTimeService(DateTimeOffset? value = null) : IDateTimeService
    {
        public DateTimeOffset Now { get; } = value ?? new DateTimeOffset(2026, 9, 2, 12, 0, 0, TimeSpan.Zero);
    }
}