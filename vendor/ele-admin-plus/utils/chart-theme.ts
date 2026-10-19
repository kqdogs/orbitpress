/** echarts 主题 */
export const ChartTheme = {
  color: [
    '#5b8ff9',
    '#61ddaa',
    '#65789b',
    '#f6bd16',
    '#7262fd',
    '#78d3f8',
    '#9661bc',
    '#f6903d',
    '#008685',
    '#f08bb4'
  ],
  backgroundColor: 'rgba(0,0,0,0)',
  textStyle: {},
  title: {
    textStyle: {
      color: '#333333'
    },
    subtextStyle: {
      color: '#666666'
    }
  },
  line: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false
  },
  radar: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false
  },
  bar: {
    barCategoryGap: '50%',
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#fff'
    }
  },
  pie: {
    itemStyle: {
      borderWidth: 2,
      borderColor: '#fff'
    }
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  candlestick: {
    itemStyle: {
      color: '#dd3f5d',
      color0: '#51bd4b',
      borderColor: '#dd3f5d',
      borderColor0: '#51bd4b',
      borderWidth: 1
    }
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    },
    lineStyle: {
      width: 1,
      color: '#bfbfbf'
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false,
    color: [
      '#5b8ff9',
      '#61ddaa',
      '#65789b',
      '#f6bd16',
      '#7262fd',
      '#78d3f8',
      '#9661bc',
      '#f6903d',
      '#008685',
      '#f08bb4'
    ],
    label: {
      color: '#666666'
    }
  },
  map: {
    itemStyle: {
      areaColor: '#fafafa',
      borderColor: '#d9d9d9',
      borderWidth: 1
    },
    label: {
      color: '#333333',
      textBorderColor: '#fff',
      textBorderWidth: 1
    },
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(255, 215, 0, 0.8)',
        borderColor: '#d9d9d9',
        borderWidth: 1
      },
      label: {
        color: '#333333'
      }
    }
  },
  geo: {
    itemStyle: {
      areaColor: '#fafafa',
      borderColor: '#d9d9d9',
      borderWidth: 1
    },
    label: {
      color: '#333333',
      textBorderColor: '#fff',
      textBorderWidth: 1
    },
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(255, 215, 0, 0.8)',
        borderColor: '#d9d9d9',
        borderWidth: 1
      },
      label: {
        color: '#333333'
      }
    }
  },
  grid: {
    top: 30,
    right: 20,
    left: 60,
    bottom: 40
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#bfbfbf'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#bfbfbf'
      },
      alignWithLabel: true
    },
    axisLabel: {
      show: true,
      color: '#666666'
    },
    splitLine: {
      show: false,
      lineStyle: {
        type: 'dashed',
        color: ['#d9d9d9']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['#f0f0f0']
      }
    }
  },
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#bfbfbf'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#bfbfbf'
      }
    },
    axisLabel: {
      show: true,
      color: '#666666'
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: ['#d9d9d9']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['#f0f0f0']
      }
    }
  },
  logAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#bfbfbf'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#bfbfbf'
      }
    },
    axisLabel: {
      show: true,
      color: '#666666'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#d9d9d9']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['#f0f0f0']
      }
    }
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#bfbfbf'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#bfbfbf'
      }
    },
    axisLabel: {
      show: true,
      color: '#666666'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#d9d9d9']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['#f0f0f0']
      }
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: '#999999'
    },
    emphasis: {
      iconStyle: {
        borderColor: '#666666'
      }
    }
  },
  legend: {
    inactiveColor: '#cccccc',
    inactiveBorderColor: '#fff',
    textStyle: {
      color: '#666666',
      lineHeight: 14
    }
  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: '#bfbfbf',
        width: 1
      },
      crossStyle: {
        color: '#bfbfbf',
        width: 1
      }
    },
    borderWidth: 0
  },
  timeline: {
    lineStyle: {
      color: '#d9d9d9',
      width: 1
    },
    itemStyle: {
      color: '#d9d9d9',
      borderWidth: 1
    },
    controlStyle: {
      color: '#d9d9d9',
      borderColor: '#d9d9d9',
      borderWidth: 0.5
    },
    checkpointStyle: {
      color: '#5b8ff9',
      borderColor: '#5b8ff9'
    },
    label: {
      color: '#999999'
    },
    emphasis: {
      itemStyle: {
        color: '#5b8ff9'
      },
      controlStyle: {
        color: '#d9d9d9',
        borderColor: '#d9d9d9',
        borderWidth: 0.5
      },
      label: {
        color: '#666666'
      }
    }
  },
  visualMap: {
    itemHeight: 80,
    itemWidth: 15,
    color: ['#5b8ff9', '#b0d0ff', '#f0f7ff'],
    textStyle: {
      color: '#666666'
    }
  },
  dataZoom: {
    handleSize: '100%',
    textStyle: {
      color: '#666666'
    }
  },
  markPoint: {
    label: {
      color: '#ffffff'
    }
  },
  markLine: {
    label: {
      color: '#666666'
    },
    lineStyle: {
      color: '#bfbfbf'
    }
  },
  markArea: {
    itemStyle: {
      color: '#ffe8e8'
    }
  },
  tree: {
    itemStyle: {
      color: '#a9d18e',
      borderColor: '#a9d18e'
    },
    lineStyle: {
      color: '#bfbfbf'
    }
  },
  treemap: {
    itemStyle: {
      borderWidth: 1,
      borderColor: '#fff'
    },
    upperLabel: {
      color: '#666666'
    }
  },
  sunburst: {
    itemStyle: {
      borderWidth: 1,
      borderColor: '#fff'
    }
  },
  calendar: {
    itemStyle: {
      color: '#fff',
      borderColor: '#bfbfbf'
    },
    dayLabel: {
      color: '#666666'
    },
    monthLabel: {
      color: '#666666'
    },
    yearLabel: {
      color: '#666666'
    }
  }
};

export const ChartThemeTransparent = {
  color: [
    '#5b8ff9',
    '#61ddaa',
    '#65789b',
    '#f6bd16',
    '#7262fd',
    '#78d3f8',
    '#9661bc',
    '#f6903d',
    '#008685',
    '#f08bb4'
  ],
  backgroundColor: 'rgba(0,0,0,0)',
  textStyle: {},
  title: {
    textStyle: {
      color: 'rgba(0, 0, 0, 0.65)'
    },
    subtextStyle: {
      color: 'rgba(0, 0, 0, 0.55)'
    }
  },
  line: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false
  },
  radar: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false
  },
  bar: {
    barCategoryGap: '50%',
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#fff'
    }
  },
  pie: {
    itemStyle: {
      borderWidth: 2,
      borderColor: '#fff'
    }
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    }
  },
  candlestick: {
    itemStyle: {
      color: 'rgba(221, 63, 93, 0.85)',
      color0: 'rgba(81, 189, 75, 0.85)',
      borderColor: 'rgba(221, 63, 93, 0.9)',
      borderColor0: 'rgba(81, 189, 75, 0.9)',
      borderWidth: 1
    }
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#fff'
    },
    lineStyle: {
      width: 1,
      color: 'rgba(0, 0, 0, 0.15)'
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false,
    color: [
      '#5b8ff9',
      '#61ddaa',
      '#65789b',
      '#f6bd16',
      '#7262fd',
      '#78d3f8',
      '#9661bc',
      '#f6903d',
      '#008685',
      '#f08bb4'
    ],
    label: {
      color: 'rgba(0, 0, 0, 0.55)'
    }
  },
  map: {
    itemStyle: {
      areaColor: 'rgba(0, 0, 0, 0.04)',
      borderColor: 'rgba(0, 0, 0, 0.08)',
      borderWidth: 1
    },
    label: {
      color: 'rgba(0, 0, 0, 0.75)',
      textBorderColor: '#fff',
      textBorderWidth: 1
    },
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(255, 193, 7, 0.25)',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderWidth: 1
      },
      label: {
        color: 'rgba(0, 0, 0, 0.85)'
      }
    }
  },
  geo: {
    itemStyle: {
      areaColor: 'rgba(0, 0, 0, 0.04)',
      borderColor: 'rgba(0, 0, 0, 0.08)',
      borderWidth: 1
    },
    label: {
      color: 'rgba(0, 0, 0, 0.75)',
      textBorderColor: '#fff',
      textBorderWidth: 1
    },
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(255, 193, 7, 0.25)',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderWidth: 1
      },
      label: {
        color: 'rgba(0, 0, 0, 0.85)'
      }
    }
  },
  grid: {
    top: 30,
    right: 20,
    left: 60,
    bottom: 40
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)'
      },
      alignWithLabel: true
    },
    axisLabel: {
      show: true,
      color: 'rgba(0, 0, 0, 0.55)'
    },
    splitLine: {
      show: false,
      lineStyle: {
        type: 'dashed',
        color: ['rgba(0, 0, 0, 0.12)']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(0, 0, 0, 0.12)']
      }
    }
  },
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)'
      }
    },
    axisLabel: {
      show: true,
      color: 'rgba(0, 0, 0, 0.55)'
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: ['rgba(0, 0, 0, 0.12)']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(0, 0, 0, 0.12)']
      }
    }
  },
  logAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)'
      }
    },
    axisLabel: {
      show: true,
      color: 'rgba(0, 0, 0, 0.55)'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['rgba(0, 0, 0, 0.12)']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(0, 0, 0, 0.12)']
      }
    }
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)'
      }
    },
    axisLabel: {
      show: true,
      color: 'rgba(0, 0, 0, 0.55)'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['rgba(0, 0, 0, 0.12)']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(0, 0, 0, 0.12)']
      }
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: 'rgba(0, 0, 0, 0.35)'
    },
    emphasis: {
      iconStyle: {
        borderColor: 'rgba(0, 0, 0, 0.55)'
      }
    }
  },
  legend: {
    inactiveColor: 'rgba(0, 0, 0, 0.25)',
    inactiveBorderColor: '#fff',
    textStyle: {
      color: 'rgba(0, 0, 0, 0.55)',
      lineHeight: 14
    }
  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.15)',
        width: 1
      },
      crossStyle: {
        color: 'rgba(0, 0, 0, 0.15)',
        width: 1
      }
    },
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 0,
    textStyle: {
      color: 'rgba(0, 0, 0, 0.75)'
    }
  },
  timeline: {
    lineStyle: {
      color: 'rgba(0, 0, 0, 0.15)',
      width: 1
    },
    itemStyle: {
      color: 'rgba(0, 0, 0, 0.15)',
      borderWidth: 1
    },
    controlStyle: {
      color: 'rgba(0, 0, 0, 0.15)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 0.5
    },
    checkpointStyle: {
      color: '#5b8ff9',
      borderColor: '#5b8ff9'
    },
    label: {
      color: 'rgba(0, 0, 0, 0.45)'
    },
    emphasis: {
      itemStyle: {
        color: '#5b8ff9'
      },
      controlStyle: {
        color: 'rgba(0, 0, 0, 0.15)',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        borderWidth: 0.5
      },
      label: {
        color: 'rgba(0, 0, 0, 0.55)'
      }
    }
  },
  visualMap: {
    itemHeight: 80,
    itemWidth: 15,
    color: [
      'rgba(91, 143, 249, 0.85)',
      'rgba(176, 208, 255, 0.6)',
      'rgba(240, 247, 255, 0.3)'
    ],
    textStyle: {
      color: 'rgba(0, 0, 0, 0.55)'
    }
  },
  dataZoom: {
    handleSize: '100%',
    textStyle: {
      color: 'rgba(0, 0, 0, 0.55)'
    }
  },
  markPoint: {
    label: {
      color: 'rgba(255, 255, 255, 0.95)'
    }
  },
  markLine: {
    label: {
      color: 'rgba(0, 0, 0, 0.55)'
    },
    lineStyle: {
      color: 'rgba(0, 0, 0, 0.15)'
    }
  },
  markArea: {
    itemStyle: {
      color: 'rgba(255, 173, 177, 0.2)'
    }
  },
  tree: {
    itemStyle: {
      color: '#a9d18e',
      borderColor: '#a9d18e'
    },
    lineStyle: {
      color: 'rgba(0, 0, 0, 0.15)'
    }
  },
  treemap: {
    itemStyle: {
      borderWidth: 1,
      borderColor: '#fff'
    },
    upperLabel: {
      color: 'rgba(0, 0, 0, 0.55)'
    }
  },
  sunburst: {
    itemStyle: {
      borderWidth: 1,
      borderColor: '#fff'
    }
  },
  calendar: {
    itemStyle: {
      color: '#fff',
      borderColor: 'rgba(0, 0, 0, 0.08)'
    },
    dayLabel: {
      color: 'rgba(0, 0, 0, 0.55)'
    },
    monthLabel: {
      color: 'rgba(0, 0, 0, 0.55)'
    },
    yearLabel: {
      color: 'rgba(0, 0, 0, 0.55)'
    }
  }
};
