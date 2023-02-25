// 节点样式
var NODE_STYLE_DICT = {
    'concrete': {
        itemStyle: {
            normal: {
                color: '#4990E2'
            }
        }
    },
    // 有因果边的事件
    'cause_effect': {
        itemStyle: {
            normal: {
                color: '#4990E2'
            }
        }
    },
    // 只有相似边的事件
    'similarity': {
        itemStyle: {
            normal: {
                color: '#B99C9E'
            }
        }
    },
    // 高亮（点击过）的事件
    'highlight': {
        itemStyle: {
            normal: {
                color: '#E47473'
            }
        }
    }
};

// 边样式
var LINK_STYLE_DICT = {
    // 因果边
    'cause_effect': {
        symbol: ['none', 'arrow'],
        symbolSize: [1, 15],
        lineStyle: {
            normal: {
                color: '#6ecf64'
            }
        }
    },
    // 顺承边
    'follow': {
        symbol: ['none', 'arrow'],
        symbolSize: [1, 15],
        lineStyle: {
            normal: {
                color: '#DA70D6'
            }
        }
    },
    // 父子边
    'subevent': {
        symbol: ['none', 'arrow'],
        symbolSize: [1, 15],
        lineStyle: {
            normal: {
                color: '#d8752f'
            }
        }
    }
};

// 记录已获取的事件
var EVENT_DICT = {};

// 记录已获取的关系
var RELATION_DICT = {};

// 图表对象
var myChart = null;


// 由事件和关系构建节点和边
function buildNodesAndLinks(eventMap, relationMap) {
    var nodes = [];
    var links = [];

    Object.values(eventMap).forEach(function(event) {
        var node = {};
        node.name = event['code'];
        node.value = event['text'];
        node.category = event['category'];
        nodes.push($.extend(node, NODE_STYLE_DICT[event['category']]));
    });

    Object.values(relationMap).forEach(function(relation) {
        var link = {};
        link.source = relation['head'];
        link.target = relation['tail'];
        link.category = relation['category'];
        if (relation['category'] === 'cause_effect' || relation['category'] === 'follow') {
            link.shortContext = relation['short_context'];
            link.shortContextImg = relation['short_context_img'];
            link.longContext = relation['long_context'];
            link.weight = relation['confidence'];
            link.eventType = relation['event_type'];
            link.articleId = relation['article_id']
        } else if (relation['category'] === 'similarity') {
            link.weight = relation['similarity'];
        }
        links.push($.extend(link, LINK_STYLE_DICT[relation['category']]));
    });

    return [nodes, links];
}


// 初始化图谱
function initGraph() {
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('main'));

    var option = {
        // 不播放动画
        animation: false,
        // 鼠标放到节点和边上时的提示
        tooltip: {
            // 文本显示方式
            formatter: function(param) {
                var dataType = param.dataType;
                if (dataType === 'node') {
                    var node = param.data;
                    return '<span style="color:' + param.color + ';">●</span> ' + node.value;
                } else if (dataType === 'edge') {
                    var link = param.data;
                    var head = EVENT_DICT[link.source];
                    var tail = EVENT_DICT[link.target];
                    return head.text + ' > ' + tail.text;
                }
            }
        },
        // 数据列
        series: [{
            // 图表类型
            type: 'graph',
            // 初始缩放
            zoom: 0.3,
            // 节点大小
            symbolSize: 90,
            // 开启滚轮缩放和平移漫游
            roam: true,
            // 布局方式
            layout: 'force',
            // 允许拖动单个节点
            draggable: true,
            // 鼠标放到节点上时，高亮显示该节点及相邻节点
            focusNodeAdjacency: true,
            // 力导向图配置
            force: {
                //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                // repulsion: [4000, 6000],
                // repulsion: [8000, 10000],
                repulsion: 20000,
                //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                gravity: 1,
                //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                // edgeLength: [20, 50],
                edgeLength: [200, 400],
                // 不显示力导向图变为平衡状态的动画（拖动节点时显示动画效果更好）
                // layoutAnimation: false
            },
            // 节点上的标签
            label: {
                normal: {
                    // 一直显示
                    show: true,
                    // 标签颜色
                    // color: '#FFF',
                    // 字号
                    fontSize: 12,
                    // 位置
                    position: 'inside',
                    // 文本显示方式
                    formatter: function(param) {
                        var node = param.data;
                        var title = node.value;
                        if (title.length < 3) {
                            return title;
                        }
                        var str = '';
                        str += title.substring(0, 3);
                        str += "\n";
                        str += title.substring(3, Math.min(7, title.length));
                        if (title.length > 6) {
                            str += "\n";
                            str += title.substring(7, Math.min(10, title.length));
                            if (title.length > 10) {
                                str += "...";
                            }
                        }
                        return str;
                    }
                }
            },
            // 边上的标签
            edgeLabel: {
                normal: {
                    // 一直显示
                    show: true,
                    // 文本样式
                    textStyle: {
                        fontSize: 10
                    },
                    // 文本显示方式
                    // TODO
                    formatter: function(param) {
                        var link = param.data;
                        var result = '';
                        if (link.weight != null) {
                            // if (link.category === 'cause_effect')
                            //     result = "因果"
                            // elif(link.category === 'follow')
                            // result = "顺承"
                            // result = link.weight.toFixed(2);
                        }
                        return result;
                    }
                }
            },
            // 通用节点样式
            itemStyle: {
                normal: {
                    // 阴影效果
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 5,
                }
            },
            // 通用边样式
            lineStyle: {
                normal: {
                    // 透明度，1为不透明
                    opacity: 1,
                    // 曲度，0为直线
                    curveness: 0
                }
            },
            // 节点数据
            nodes: [],
            // 边数据
            links: []
        }]
    };

    myChart.setOption(option);
}


// 重新加载图谱
function reloadGraph(events, relations) {
    // 清除原来的事件和关系
    EVENT_DICT = {};
    RELATION_DICT = {};

    events.forEach(function(event) {
        EVENT_DICT[event['code']] = event;
    });

    relations.forEach(function(relation) {
        RELATION_DICT[relation['code']] = relation;
    });

    var result = buildNodesAndLinks(EVENT_DICT, RELATION_DICT);
    var nodes = result[0];
    var links = result[1];

    var option = myChart.getOption();
    option.series[0].nodes = nodes;
    option.series[0].links = links;
    myChart.setOption(option);
}


// 将数据拓展到图谱
function expandGraph(expandedEventCode, events, relations) {
    var isExpanded = false;

    events.forEach(function(event) {
        if (!(event['code'] in EVENT_DICT)) {
            EVENT_DICT[event['code']] = event;
            isExpanded = true;
        }
    });

    relations.forEach(function(relation) {
        if (!(relation['code'] in RELATION_DICT)) {
            RELATION_DICT[relation['code']] = relation;
            isExpanded = true;
        }
    });

    // 为被拓展的节点加高亮
    // EVENT_DICT[expandedEventCode]['category'] = 'highlight';

    var result = buildNodesAndLinks(EVENT_DICT, RELATION_DICT);
    var nodes = result[0];
    var links = result[1];

    var option = myChart.getOption();
    option.series[0].nodes = nodes;
    option.series[0].links = links;
    myChart.setOption(option);

    if (!isExpanded) {
        toastr.warning('不能继续拓展');
    }
}


// 使用ajax查询数据
function ajaxQuery(data, success, error) {
    // $.ajax({
    //     type: 'GET',
    //     url: '/api/query_event',
    //     data: data,
    //     dataType: 'json',
    //     success: success,
    //     error: error
    // })
    data = {
        "events": [{
                "code": "ce_005",
                "category": "concrete",
                "text": "一群武装劫匪盗窃一家珠宝店"
            },
            {
                "code": "ce_006",
                "category": "concrete",
                "text": "涉嫌窃贼尾随一名员工"
            },
            {
                "code": "ce_007",
                "category": "concrete",
                "text": "犯罪嫌疑人砸碎几个玻璃陈列柜"
            }, {
                "code": "ce_008",
                "category": "concrete",
                "text": "犯罪嫌疑人逃离商店"
            }, {
                "code": "ce_009",
                "category": "concrete",
                "text": "犯罪嫌疑人拿走珠宝"
            }

        ],
        "relations": [{
                "code": "cce_005",
                "category": "follow",
                "head": "ce_006",
                "tail": "ce_007",
                "cause": "ce_006",
                "effect": "ce_007",
                "short_context": '据当局称，涉嫌窃贼戴着口罩和手套，于晚上 7 点 45 分左右尾随一名员工进入商店前门。犯罪嫌疑人将员工逼到地板上，砸碎了几个玻璃陈列柜，并在不到一分钟内逃离了商店，然后将里面的珠宝拿走了。',
                "long_context": '警方称，周五，一群武装劫匪从新泽西州的一家珠宝店盗窃。据当局称，涉嫌窃贼戴着口罩和手套，于晚上 7 点 45 分左右<span class="cause">尾随一名员工进入商店前门</span>。犯罪嫌疑人将员工逼到地板上，<span class="effect">砸碎了几个玻璃陈列柜</span>，并在不到一分钟内逃离了商店，然后将里面的珠宝拿走了。',
                "confidence": 200.0,
                "short_context_img": "./event2_1.gif"

            },
            {
                "code": "cce_006",
                "category": "follow",
                "head": "ce_007",
                "tail": "ce_008",
                "cause": "ce_007",
                "effect": "ce_008",
                "short_context": "犯罪嫌疑人将员工逼到地板上，砸碎了几个玻璃陈列柜，并在不到一分钟内逃离了商店，然后将里面的珠宝拿走了。",
                "long_context": '警方称，周五，一群武装劫匪从新泽西州的一家珠宝店盗窃。据当局称，涉嫌窃贼戴着口罩和手套，于晚上 7 点 45 分左右尾随一名员工进入商店前门。犯罪嫌疑人将员工逼到地板上，<span class="cause">砸碎了几个玻璃陈列柜</span>，并在不到一分钟内<span class="effect">逃离了商店</span>，然后将里面的珠宝拿走了。',
                "confidence": 200.0,
                "short_context_img": "./event2_2.gif"

            }, {
                "code": "cce_007",
                "category": "follow",
                "head": "ce_008",
                "tail": "ce_009",
                "cause": "ce_008",
                "effect": "ce_009",
                "short_context": "犯罪嫌疑人将员工逼到地板上，砸碎了几个玻璃陈列柜，并在不到一分钟内逃离了商店，然后将里面的珠宝拿走了。",
                "long_context": '警方称，周五，一群武装劫匪从新泽西州的一家珠宝店盗窃。据当局称，涉嫌窃贼戴着口罩和手套，于晚上 7 点 45 分左右尾随一名员工进入商店前门。犯罪嫌疑人将员工逼到地板上，砸碎了几个玻璃陈列柜，并在不到一分钟内<span class="cause">逃离了商店</span>，然后<span class="cause">将里面的珠宝拿走了</span>。',
                "confidence": 200.0,
                "short_context_img": "./event2_3.gif"

            },
            {
                "code": "cce_008",
                "category": "subevent",
                "head": "ce_005",
                "tail": "ce_006",
                "confidence": 200.0
            },
            {
                "code": "cce_009",
                "category": "subevent",
                "head": "ce_005",
                "tail": "ce_007",
                "confidence": 200.0
            },
            {
                "code": "cce_010",
                "category": "subevent",
                "head": "ce_005",
                "tail": "ce_008",
                "confidence": 200.0
            },
            {
                "code": "cce_011",
                "category": "subevent",
                "head": "ce_005",
                "tail": "ce_009",
                "confidence": 200.0
            }
        ]
    }
    console.log(data)
    success(data)
}


$(document).ready(function() {
    // 初始化图谱
    initGraph();

    // 获取数据
    ajaxQuery({ text: '下雨', layers: 2 },
        // 成功
        function(result) {
            reloadGraph(result['events'], result['relations']);
        },
        // 失败
        function() {
            toastr.error('加载图谱数据失败');
        }
    );

    // 双击事件拓展图谱
    // myChart.on('dblclick', function(param) {
    //     if (param.dataType === 'node') {
    //         var node = param.data;
    //         ajaxQuery({ text: node.value, layers: 1 },
    //             // 成功
    //             function(result) {
    //                 expandGraph(node.name, result['events'], result['relations']);
    //             },
    //             // 失败
    //             function() {
    //                 expandGraph(node.name, [], []);
    //             }
    //         );
    //     }
    // });

    // 鼠标放到因果边上时显示上下文
    myChart.on('mouseover', function(param) {
        if (param.dataType === 'edge') {
            var link = param.data;
            if (link.category === 'cause_effect' || link.category === 'follow') {
                var cause = EVENT_DICT[link.source].text;
                var effect = EVENT_DICT[link.target].text;
                var shortContext = link.shortContext;
                var longContext = link.longContext;
                var shortContextImg = link.shortContextImg;

                var richCause = '<span class="cause">' + cause + '</span>';
                var richEffect = '<span class="effect">' + effect + '</span>';
                var richLongContextImage = '<image style="width:100%" src="' + shortContextImg + '" >';

                // var richShortContext = shortContext;
                // richShortContext = richShortContext.replace(cause, richCause);
                // richShortContext = richShortContext.replace(effect, richEffect);
                // var richLongContext = longContext.replace(shortContext, richShortContext);
                var richLongContext = longContext;
                var eventType = link.eventType;
                var articleId = link.articleId;
                var label = link.category === 'cause_effect' ? ['原因', '结果'] : ['前事件', '后事件']
                $('#article-id').html(articleId)
                $('#event-type').html(eventType)
                $('#label-first').html(label[0])
                $('#label-second').html(label[1])
                $('#cause').html(richCause);
                $('#effect').html(richEffect);
                $('#context').html(richLongContext);
                $('#context_img').html(richLongContextImage);
            }
        }
    });

    // 提交查询
    $('.search-box').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault();

        // 使用ajax提交
        ajaxQuery({ text: $('#search-text').val(), layers: 2 },
            // 成功
            function(result) {
                toastr.success('查询成功');
                reloadGraph(result['events'], result['relations'])
            },
            // 失败
            function() {
                toastr.warning('未查询到相关数据');
            }
        );
    });

    // 点击推荐查询
    $('.recommend-search').click(function(e) {
        e.preventDefault();
        $('#search-text').val($(this).text());
        $('.search-box').submit();
    });

    // 窗口大小改变时，重新调整图谱大小
    $(window).resize(function() {
        myChart.resize();
    });

}); // $(document).ready