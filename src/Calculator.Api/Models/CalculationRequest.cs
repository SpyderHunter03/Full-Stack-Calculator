namespace Calculator.Api.Models;

public sealed record CalculationRequest(decimal Left, decimal Right, string Operator);