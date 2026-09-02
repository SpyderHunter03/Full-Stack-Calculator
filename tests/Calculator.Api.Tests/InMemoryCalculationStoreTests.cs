using Calculator.Api.Models;
using Calculator.Api.Services;

namespace Calculator.Api.Tests;

public sealed class InMemoryCalculationStoreTests
{
    [Fact]
    public void Add_and_get_all_returns_stored_calculations()
    {
        var store = new InMemoryCalculationStore();
        var first = CreateResult(1);
        var second = CreateResult(2);

        store.Add(first);
        store.Add(second);

        Assert.Equal([first, second], store.GetAll());
    }

    [Fact]
    public void Clear_by_id_removes_only_the_matching_calculation()
    {
        var store = new InMemoryCalculationStore();
        var first = CreateResult(1);
        var second = CreateResult(2);
        store.Add(first);
        store.Add(second);

        store.Clear(first.Id);

        Assert.Equal([second], store.GetAll());
    }

    [Fact]
    public void Clear_without_an_id_removes_all_calculations()
    {
        var store = new InMemoryCalculationStore();
        store.Add(CreateResult(1));
        store.Add(CreateResult(2));

        store.Clear();

        Assert.Empty(store.GetAll());
    }

    private static CalculationResult CreateResult(int value) =>
        new(Guid.NewGuid(), value, $"{value}", DateTimeOffset.UtcNow);
}