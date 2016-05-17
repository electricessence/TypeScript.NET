/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
declare module HowMany {
    module Hours {
        const enum Per {
            Day = 24,
        }
    }
    module Minutes {
        const enum Per {
            Hour = 60,
            Day = 1440,
        }
    }
    module Seconds {
        const enum Per {
            Minute = 60,
            Hour = 3600,
            Day = 86400,
        }
    }
    module Milliseconds {
        const enum Per {
            Second = 1000,
            Minute = 60000,
            Hour = 3600000,
            Day = 86400000,
        }
    }
    module Ticks {
        const enum Per {
            Millisecond = 10000,
            Second = 10000000,
            Minute = 600000000,
            Hour = 36000000000,
            Day = 864000000000,
        }
    }
}
