namespace Calculator.Api.Models;

public sealed record CalculationResult(Guid Id, decimal Value, DateTimeOffset CreatedAt);