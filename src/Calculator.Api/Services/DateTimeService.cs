namespace Calculator.Api.Services;

public sealed class DateTimeService : IDateTimeService
{
    public DateTimeOffset Now => DateTimeOffset.UtcNow;
}