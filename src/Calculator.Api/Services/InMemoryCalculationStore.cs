using System.Collections.Concurrent;
using Calculator.Api.Models;

namespace Calculator.Api.Services;

public sealed class InMemoryCalculationStore : ICalculationStore
{
    private readonly ConcurrentQueue<CalculationResult> calculations = new();

    public void Add(CalculationResult result) => calculations.Enqueue(result);

    public IReadOnlyCollection<CalculationResult> GetAll() => calculations.ToArray();
}