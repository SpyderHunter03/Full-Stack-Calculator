using Calculator.Api.Models;
using Calculator.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Calculator.Api.Controllers;

[ApiController]
[Route("api/calculations")]
public sealed class CalculatorController(ICalculator calculator, ICalculationStore store) : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyCollection<CalculationResult>> GetAll() => Ok(store.GetAll());

    [HttpPost]
    public ActionResult<CalculationResult> Calculate(CalculationRequest request)
    {
        try
        {
            return Ok(calculator.Calculate(request));
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { error = exception.Message });
        }
    }

    [HttpDelete("{id:guid?}")]
    public ActionResult Clear(Guid? id)
    {
        try
        {
            if (id is null)
            {
                store.Clear();
                return Ok();
            }
            store.Clear(id.Value);
            return Ok();
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { error = exception.Message });
        }
    }
}