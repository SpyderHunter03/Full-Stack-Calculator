using Calculator.Api.Models;

namespace Calculator.Api.Services;

public interface ICalculator
{
    CalculationResult Calculate(CalculationRequest request);
}