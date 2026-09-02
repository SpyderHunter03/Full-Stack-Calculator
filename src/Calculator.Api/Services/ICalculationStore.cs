using Calculator.Api.Models;

namespace Calculator.Api.Services;

public interface ICalculationStore
{
    void Add(CalculationResult result);
    IReadOnlyCollection<CalculationResult> GetAll();
    void Clear(Guid id);
    void Clear();
}