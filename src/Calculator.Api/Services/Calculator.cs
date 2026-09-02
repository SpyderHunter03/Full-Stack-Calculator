using Calculator.Api.Models;

namespace Calculator.Api.Services;

public sealed class Calculator(ICalculationStore store, IDateTimeService dateTimeService) : ICalculator
{
    public CalculationResult Calculate(CalculationRequest request)
    {
        var value = request.Operator switch
        {
            "+" => request.Left + request.Right,
            "-" => request.Left - request.Right,
            "*" => request.Left * request.Right,
            "/" when request.Right != 0 => request.Left / request.Right,
            "/" => throw new DivideByZeroException("Cannot divide by zero."),
            "%" => request.Left % request.Right,
            _ => throw new ArgumentException("Unsupported operation.", nameof(request))
        };

        var expression = $"{request.Left} {request.Operator} {request.Right}";
        var result = new CalculationResult(Guid.NewGuid(), value, expression, dateTimeService.Now);
        store.Add(result);
        return result;
    }
}