using Calculator.Api.Models;

namespace Calculator.Api.Services;

public sealed class Calculator(ICalculationStore store) : ICalculator
{
    public CalculationResult Calculate(CalculationRequest request)
    {
        var value = request.Operator switch
        {
            "+" => request.Left + request.Right,
            "-" => request.Left - request.Right,
            "*" => request.Left * request.Right,
            "/" when request.Right != 0 => request.Left / request.Right,
            _ => throw new ArgumentException("Unsupported operation.", nameof(request))
        };

        var result = new CalculationResult(Guid.NewGuid(), value, DateTimeOffset.UtcNow);
        store.Add(result);
        return result;
    }
}