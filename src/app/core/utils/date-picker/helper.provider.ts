import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";

export function provideGlobalNgbDatepickerConfig(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: NgbDatepickerConfig,
            useFactory: () => {
                const config = new NgbDatepickerConfig();
                const today = new Date();

                config.minDate = { year: 1900, month: 1, day: 1 };
                config.maxDate = {
                    year: today.getFullYear(),
                    month: today.getMonth() + 1,
                    day: today.getDate()
                };
                config.outsideDays = 'hidden';

                return config;
            }
        }
    ]);
}
