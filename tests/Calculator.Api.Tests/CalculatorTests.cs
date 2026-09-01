using Calculator.Api.Models;
using Calculator.Api.Services;

namespace Calculator.Api.Tests;

public sealed class CalculatorTests
{
    [Fact]
    public void Calculate_Adds_two_numbers_and_stores_the_result()
    {
        var store = new InMemoryCalculationStore();
        var calculator = new Calculator.Api.Services.Calculator(store);

        var result = calculator.Calculate(new CalculationRequest(2, 3, "+"));

        Assert.Equal(5, result.Value);
        Assert.Single(store.GetAll());
    }
}