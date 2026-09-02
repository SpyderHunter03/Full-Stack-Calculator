namespace Calculator.Api.Services;

public interface IDateTimeService
{
    DateTimeOffset Now { get; }
}