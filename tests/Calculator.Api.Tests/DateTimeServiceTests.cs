using Calculator.Api.Services;

namespace Calculator.Api.Tests;

public sealed class DateTimeServiceTests
{
    [Fact]
    public void Now_returns_a_utc_timestamp_near_the_current_time()
    {
        var before = DateTimeOffset.UtcNow;
        var now = new DateTimeService().Now;
        var after = DateTimeOffset.UtcNow;

        Assert.InRange(now, before, after);
        Assert.Equal(TimeSpan.Zero, now.Offset);
    }
}