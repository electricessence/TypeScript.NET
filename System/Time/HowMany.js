/*
 * @author electricessence / https://github.com/electricessence/
 * Originally based upon .NET source but with many additions and improvements.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
define(["require", "exports"], function (require, exports) {
    var HowMany;
    (function (HowMany) {
        var Hours;
        (function (Hours) {
            var Per;
            (function (Per) {
                Per.Day = 24;
            })(Per = Hours.Per || (Hours.Per = {}));
            Object.freeze(Per);
        })(Hours = HowMany.Hours || (HowMany.Hours = {}));
        Object.freeze(Hours);
        var Minutes;
        (function (Minutes) {
            var Per;
            (function (Per) {
                Per.Hour = 60;
                Per.Day = Per.Hour * Hours.Per.Day;
            })(Per = Minutes.Per || (Minutes.Per = {}));
            Object.freeze(Per);
        })(Minutes = HowMany.Minutes || (HowMany.Minutes = {}));
        Object.freeze(Minutes);
        var Seconds;
        (function (Seconds) {
            var Per;
            (function (Per) {
                Per.Minute = 60;
                Per.Hour = Per.Minute * Minutes.Per.Hour;
                Per.Day = Per.Hour * Hours.Per.Day;
            })(Per = Seconds.Per || (Seconds.Per = {}));
            Object.freeze(Per);
        })(Seconds = HowMany.Seconds || (HowMany.Seconds = {}));
        Object.freeze(Seconds);
        var Milliseconds;
        (function (Milliseconds) {
            var Per;
            (function (Per) {
                Per.Second = 1000;
                Per.Minute = Per.Second * Seconds.Per.Minute;
                Per.Hour = Per.Minute * Minutes.Per.Hour;
                Per.Day = Per.Hour * Hours.Per.Day;
            })(Per = Milliseconds.Per || (Milliseconds.Per = {}));
            Object.freeze(Per);
        })(Milliseconds = HowMany.Milliseconds || (HowMany.Milliseconds = {}));
        Object.freeze(Milliseconds);
        var Ticks;
        (function (Ticks) {
            var Per;
            (function (Per) {
                Per.Millisecond = 10000;
                Per.Second = Per.Millisecond * Milliseconds.Per.Second;
                Per.Minute = Per.Second * Seconds.Per.Minute;
                Per.Hour = Per.Minute * Minutes.Per.Hour;
                Per.Day = Per.Hour * Hours.Per.Day;
            })(Per = Ticks.Per || (Ticks.Per = {}));
            Object.freeze(Per);
        })(Ticks = HowMany.Ticks || (HowMany.Ticks = {}));
        Object.freeze(Ticks);
    })(HowMany || (HowMany = {}));
    return HowMany;
});
//# sourceMappingURL=HowMany.js.map