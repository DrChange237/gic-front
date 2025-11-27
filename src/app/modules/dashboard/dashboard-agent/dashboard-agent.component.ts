import { Component, OnInit } from '@angular/core';
//
import {AccountService} from "../../../core/services/account.service";
import {AccountBalance, StatsOperation, StatsService} from "../../../shared/interfaces";
import {Permission} from "../../../shared/enums/permission";
import {CommonService} from "../../../core/services/common.service";
import {AuthService} from "../../../core/services/auth.service";

@Component({
    selector: 'app-dashboard-agent',
    templateUrl: './dashboard-agent.component.html',
    styleUrls: ['./dashboard-agent.component.scss'],
    standalone: false
})
export class DashboardAgentComponent implements OnInit {
    monthsChartBar: any;
    servicesChartPie: any;

    operationAcc: AccountBalance;
    commissionAcc: AccountBalance;

    protected readonly Permission = Permission;

	constructor(
        public authSrv: AuthService,
        private commonSrv: CommonService,
        private accountSrv: AccountService,
    ) { }

	ngOnInit() {
        this.getAccounts();
        this.accountSrv.getStatsByService().subscribe(res => this.setCharServicesStats(res));
        this.accountSrv.getStatsMonths().subscribe(res => this.setCharMonthStats(res));
	}

    getAccounts() {
        if (this.authSrv.hasPermission(Permission.ACCOUNT_OPERATION_VIEW)) {
          this.accountSrv.getAccountOperation().subscribe(res => this.operationAcc = res);
        }

        if (this.authSrv.hasPermission(Permission.ACCOUNT_COMMISSION_VIEW)) {
          this.accountSrv.getAccountCommission().subscribe(res => this.commissionAcc = res);
        }

    }

    setCharMonthStats(data: StatsOperation[]) {
        const value = Math.max(...data.map(item => item.totalAmount));
        const maxTotalAmount = Math.ceil(value / 1000) * 1000;

        this.monthsChartBar = {
            legend: {
                borderRadius: 0,
                orient: 'horizontal',
                data: ['Operation', 'Commission']
            },
            grid: {
                left: '6px',
                right: '6px',
                bottom: '0',
                containLabel: true
            },
            tooltip: {
                show: true,
                backgroundColor: 'rgba(0, 0, 0, .8)',
                textStyle: {
                    color: 'white'
                }
            },
            xAxis: [{
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                axisTick: {
                    alignWithLabel: true
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: true
                }
            }],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} XAF'
                    },
                    min: 0,
                    max: maxTotalAmount,
                    interval: maxTotalAmount / 5,
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        interval: 'auto'
                    }
                }
            ],

            series: [
                {
                    name: 'Operation',
                    data: data.map(s => s.totalAmount),
                    label: { show: false, color: '#6E3A96' },
                    type: 'bar',
                    color: '#6E3A96',
                    // smooth: true
                },
                {
                    name: 'Commission',
                    data: data.map(s => s.totalCommission),
                    label: { show: false, color: '#bcbbdd' },
                    type: 'bar',
                    barGap: 0,
                    color: '#4CAF50',
                    smooth: true,
                }

            ]
        };
    }

    setCharServicesStats(data: StatsService[]) {
        const colors = [
            // Violet, Vert, Bleu, Orange
            "#8A2EC4", "#A0D92C", "#058EFC", "#FF8E1A",
            "#6E3A96", "#96C33A", "#3DA7F2", "#F2A03D",
            "#9C6EC4", "#B0D760", "#6FC1FF", "#FFBE6F",
            "#4E2670",  "#7FA02A", "#1E82C5", "#C77E23",
            "#D9C7EC", "#C9E48A", "#A5DAFF", "#FFD7A5",
        ]
        this.servicesChartPie = {
            color: colors.slice(0, data.length),
            tooltip: {
                show: true,
                backgroundColor: 'rgba(0, 0, 0, .8)',
                textStyle: {
                    color: 'white'
                }
            },

            xAxis: [{
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }

            ],
            yAxis: [{
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }
            ],
            series: [{
                name: this.commonSrv.translate.instant('dashboard.stats_by_services'),
                type: 'pie',
                radius: '75%',
                center: ['50%', '50%'],
                data: data.map(s => ({ value: s.totalAmount, name: s.serviceName })),
                itemStyle: {}
            }
            ]
        };
    }
}
