using System.Collections.Concurrent;
using Calculator.Api.Models;

namespace Calculator.Api.Services;

public sealed class InMemoryCalculationStore : ICalculationStore
{
    private readonly List<CalculationResult> calculations = new();

    public void Add(CalculationResult result) => calculations.Add(result);

    public IReadOnlyCollection<CalculationResult> GetAll() => [.. calculations];

    public void Clear(Guid id) => calculations.RemoveAll(c => c.Id == id);

    public void Clear() => calculations.Clear();
}