import React, { useState } from 'react';
import { Layout, Row, Col, Input, Card, Button, Empty, Upload, Avatar, message, Image } from 'antd';

import { CaretRightOutlined, InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import qs from 'qs';

import logo from './logo.png';
import './App.less';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Meta } = Card;

const tabList = [
  { key: 'entity', tab: '实体/关系' },
  { key: 'event', tab: '事件抽取' },
  { key: 'graph', tab: '知识图谱' },
];

function EntityContent(props) {
  let src = null;
  let src2 = null;
  let src3 = null;
  let src4 = null;
  let src5 = null;
  let src6 = null;
  let src7 = null;
  let src8 = null;
  let rel1 = null;
  let rel2 = null;
  let rel3 = null;
  let rel4 = null;
  let rel5 = null;
  let text = null;
  let rel_text = {};
  if (props.inputText && props.inputText.indexOf("一群武装劫匪") !== -1) {
    src = "/sample1.html";
    src2 = "/static/ner1.html";
    src3 = "/static/image2_6_box.png";
    src4 = "/static/image2_5_box.png";
    src5 = "/static/image2_3_box.png";
    src6 = "/static/image2_4_box.png";
    src7 = "/static/image2_2_box.png";
    src8 = "/static/image2_1_box.png";
    rel1 = "/static/rel2_1_box.png";
    rel2 = "/static/rel2_2_box.png";
    rel3 = "/static/rel2_3_box.png";
    rel4 = "/static/rel2_4_box.png";
    rel5 = "/static/rel2_5_box.png";
    text = [
      '人-1', '手套', '柜子-1', '椅子-1', '人-2', '人-3'
    ];
    rel_text = [
      ['人坐在椅子上', '坐'],
      ['人戴着手套', '戴'],
      ['人砸着桌子.', '砸'],
      ['人拿着抢', '拿'],
      ['人翻过桌子.', '翻']
    ]
  } else if (props.inputText && props.inputText.indexOf("警方正在追捕四名小偷")) {
    src = "/sample2.html";
    src2 = "/static/ner2.html";
    src3 = "/static/image1_box.png"; // image1.png
    src4 = "/static/image2_box.png"; // image2.png
    src5 = "/static/image3_box.png"; // image3.png
    src6 = "/static/image4_box.png"; // image4.png
    src7 = "/static/image5_box.png"; // image4.png
    src8 = "/static/image6_box.png"; // image4.png
    rel1 = "/static/rel1_box.png"; // rel1.png
    rel2 = "/static/rel2_box.png"; // rel2.png
    rel3 = "/static/rel3_box.png"; // rel3.png
    rel4 = "/static/rel4_box.png"; // rel4.png
    rel5 = "/static/rel5_box.png"; // rel4.png
    text = [
      '人-1', '人-2', '人-3', '包-1', '商店', '包-2'
    ];
    rel_text = [
      ['人拿着包', '拿'],
      ['人站在地板上', '站'],
      ['人背着包', '背'],
      ['包在架子上面.', '在上面'],
      ['人在柜子旁边.', '在旁边'],
    ]
  }
  
  return (
    src === null ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
      <div className="entity-content-wrapper">
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="领域命名实体识别"
            description="SocialEntityRecognition"
          />
        </Card>
        <iframe className="entity-content-iframe" src={src2}></iframe>
        <iframe className="entity-content-iframe" src={src}></iframe>
        
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="视觉实体识别"
            description="mmkg-visual-entity-recognition"
          />
        </Card>
        <Row>
          <div style={{height: '450px', width: '100%', 
            margin: '5px auto',
            overflowX: 'scroll',
            overflowY: 'hidden',
            whiteSpace: 'nowrap',
            paddingBottom: '10px'
              }}>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src3} width='100%'/>}
            >
              <Meta title={"实体识别 : " + text[0]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src4} width='100%'/>}
            >
              <Meta title={"实体识别 : " + text[1]} />

            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src5} width='100%'/>}
            >
              <Meta title={"实体识别 : " + text[2]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src6} width='100%'/>}
            >
              <Meta title={"实体识别 : " + text[3]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src7} width='100%'/>}
            >
              <Meta title={"实体识别 : " + text[4]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src8} width='100%'/>}
            >
              <Meta title={"实体识别 : " + text[5]} />
            </Card>
          </div>
        </Row>
        
        <br/><br/><br/>
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="视觉关系检测"
            description="mmkg-vrd"
          />
        </Card>
        <Row gutter={10}>
          <div style={{height: '500px', width: '100%', 
            margin: '5px auto',
            overflowX: 'scroll',
            overflowY: 'hidden',
            whiteSpace: 'nowrap',
            paddingBottom: '10px'
          }}>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={rel1} width='100%'/>}
            >
              <Meta title={"关系抽取 : " + rel_text[0][1]} description={rel_text[0][0]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={rel2} width='100%'/>}
            >
              <Meta title={"关系抽取 : " + rel_text[1][1]} description={rel_text[1][0]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={rel3} width='100%'/>}
            >
              <Meta title={"关系抽取 : " + rel_text[2][1]} description={rel_text[2][0]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={rel4} width='100%'/>}
            >
              <Meta title={"关系抽取 : " + rel_text[3][1]} description={rel_text[3][0]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={rel5} width='100%'/>}
            >
              <Meta title={"关系抽取 : " + rel_text[4][1]} description={rel_text[4][0]} />
            </Card>
          </div>
        </Row>
      </div>
    )
  );
}

function EventContent(props) {
  let src = null;
  let src2 = null;
  let src3 = null;
  let src4 = null;
  let text = null;
  let eve = null;

  if (props.inputText && props.inputText.indexOf("一群武装劫匪") !== -1) {
    src = "/static/event2.html";
    src2 = "/static/event2_1.gif";
    src3 = "/static/event2_2.gif";
    src4 = "/static/event2_3.gif";
    text =  text = [ 
      "一群武装劫匪尾随一名员工",
      "犯罪嫌疑人砸碎了几个玻璃陈列柜",
      "犯罪嫌疑人逃离商店",
    ];
    eve = "rob"
  } else if (props.inputText && props.inputText.indexOf("警方正在追捕四名小偷")) {
    src = "/static/event1.html";
    src2 = "/static/event1_1.gif";
    src3 = "/static/event1_2.gif";
    text = [ 
      "一些小偷正在偷走商店商品",
      "一些小偷正在偷走商店商品",
    ];
    eve = "steal"
  }

  return (
    src === null ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
      <div className="event-content-wrapper">
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="事件抽取算法EventExtraction"
            description="event_extraction"
          />
        </Card>
        <iframe className="event-content-iframe" src={src} scrolling="no"></iframe>
        <Row>
          <div style={{height: '300px', width: '100%', 
            margin: '5px auto',
            overflowX: 'scroll',
            overflowY: 'hidden',
            whiteSpace: 'nowrap',
            paddingBottom: '10px'
              }}>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src2} width='100%'/>}
            >
              <Meta description={text[0]} />
            </Card>
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src3} width='100%'/>}
            >
              <Meta description={text[1]} />
            </Card>
            {
              src4 ? (
            <Card
              style={{
                height: '100%',
                width: '300px',
                marginRight: '15px',
                display: 'inline-block'
              }}
              cover={<Image src={src4} width='100%'/>}
            >
              <Meta description={text[2]} />
            </Card>) : null
            }
          </div>
        </Row>
        {/* <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="图片关系识别"
            description="DomainEntityExtractPaddle.entity_lst(Args)"
          />
        </Card>
        <Row gutter={10}>
          <Col span={12}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src2} />}
            >
            <Meta title={"事件抽取 : "+ eve} description={text} />
          </Card>
          </Col>
        </Row> */}
      </div>
    )
  );
}

function getWords() {
  const graph = JSON.parse(document.getElementById("graph-content-iframe").contentWindow.statements_graph.replaceAll(/&#39;/g, '"'));
  const words = graph.nodes
		.filter(x => /* x.category === 1 || */x.category === 3)
		.map(x => x.category === 1 ? x.sent : x.name)
		.filter(x => x && !x.startsWith("__"))
		.map(x => x.replaceAll(" ", ""));
  return words;
}

function GraphContent(props) {
  const [previewImageURL, setPreviewImageURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);

  let egg = null
  if (props.inputText && props.inputText.indexOf("一群武装劫匪") !== -1) {
    egg = "/static/egg2.html";
  
  } else if (props.inputText && props.inputText.indexOf("警方正在追捕四名小偷")) {
    egg = "/static/egg1.html";
  }

  return (
    <div className="graph-content-wrapper">
      {/* <Card className="algorithm-card">
        <Meta
          avatar={<Avatar src="/static/logo.png" />}
          title="挖掘上位词"
          description="hypernym_extract"
        />
      </Card>
      <Card className="algorithm-card">
        <Meta
          avatar={<Avatar src="/static/logo.png" />}
          title="视觉-文本实体链接"
          description="VisualEntityLinking(image, text)"
        />
      </Card> */}
      <Card >
        <Meta
          title="多媒体知识图谱"
        />
      </Card>
      {/* {
        props.graphPage && (
          <div className="graph-content-image-upload-wrapper">
            <Dragger
              name="image"
              multiple={false}
              action="https://api0.mmkg.sota.wiki/v1/mmkg_demo"
              data={() => ({sents_form: JSON.stringify(getWords())})}
              showUploadList={false}
              beforeUpload={file => {
                if (file.type.indexOf("image") === -1) {
                  message.error(`只支持图片文件: ${file.name}`);
                  return Upload.LIST_IGNORE;
                }
                setPreviewImageURL(window.URL.createObjectURL(file));
                return true;
              }}
              onChange={({ file }) => {
                if (file.status === "uploading") {
                  setUploading(true);
                } else if (file.status === "done") {
                  setUploading(false);
                  const rsp = file.response;
                  if (rsp.code === 0) {
                    const sorted_words = rsp.data.sort((a, b) => b[2] - a[2]);
                    setResults(sorted_words);
                  } else {
                    console.error(rsp);
                  }
                }
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">增加新图像及链接入图谱</p>
              <p className="ant-upload-hint">点击上传图片文件</p>
            </Dragger>
            {
              previewImageURL && (
                <div className="preview-image-wrapper">
                  <Spin spinning={uploading}>
                    <Image width={200} src={previewImageURL} />
                  </Spin>
                </div>
              )
            }
            {
              results && results.length > 0 && (
                <div className="img-to-text-results-wrapper">
                  {
                    results.map(item => (
                      <div className="img-to-text-result-box">
                        <div className="word">{item[0]}: </div>
                        <div className="score">{item[2].toFixed(4)}</div>
                      </div>
                    ))
                  }
                </div>
              )
            }
          </div>
        )
      } */}
      {
        props.graphPage === null ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
          <iframe id="graph-content-iframe" srcDoc={props.graphPage} onLoad={e => {
            setTimeout(() => e.target.contentWindow.comp_graphs(), 1);
          }}></iframe>
        )
      }
      {/* {
        props.graphPage && (
          <div id="div0">
            <div id="bigcilin">
              <div id="entity0"></div>
              <div id="entity1"></div>
              <div id="entity2"></div>
            </div>
          </div>
        )
      } */}
      <Card >
        <Meta
          title="事件图谱"
        />
      </Card>
      <iframe className="event-content-iframe" src={egg} ></iframe>

    </div>
  );
}

const fetchGraphPage = async (text) => {
  return await axios.post("https://api0.mmkg.sota.wiki/legacy/structuring", qs.stringify({ text: text }));
};

function App() {
  const [inputText, setInputText] = useState('');
  const [activeTabKey, setActiveTabKey] = useState('entity');
  const [cardLoading, setCardLoading] = useState(false);
  const [graphPage, setGraphPage] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [searchURL, setSearchURL] = useState("");
  const [graphPageLastText, setGraphPageLastText] = useState('');
  const [showElem, setShowElem] = useState(false);


  return (
    <Layout className="app" style={{ minHeight: '100vh' , backgroundColor : '#FFFFFF'}}>
      <Header className="app-header">
        <Row justify="center">
          <Col span={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img className="app-logo" src={logo} alt="logo" />
          </Col>
          <Col span={18} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span className="app-titile">自动化知识发现与图谱构建</span>
          </Col>
          <Col span={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          </Col>
        </Row>
      </Header>
      <Content>
        <Row justify="center" style={{margin : '10px'}}>
          <Col span={16}>
            <Card title="加载信息" style={{ borderWidth : '2px', borderColor: '#CCCCCC', borderRadius : '10px', boxShadow: '4px 4px #CCCCCC' }}>
            <Row justify='center' style={
              {
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px',
              }
            }>
              <Input.Group compact>
              <Input
                style={{
                  width: 'calc(100% - 100px)',
                }}
                placeholder='请输入爬取页面网址'
                onChange={e => setSearchURL(e.target.value)}
              />
              <Button 
                type="primary" 
                style={{
                  width: '100px',
                }}
                onClick={
                  () => {
                    if(searchURL.indexOf('europe') !== -1) { // https://www.bbc.com/news/world-europe-7563
                      ;
                    }
                    else if(searchURL.indexOf('american') !== -1) { // https://www.bbc.com/news/world-american-4273
                      ;
                    } else {
                      message.error("请填写正确的网址", 1)
                      return
                    }
                    message.loading("加载中....", 1.8)
                    setTimeout(() => {
                      message.success("加载成功")
                      if(searchURL.indexOf('europe') !== -1) {
                        setVideoURL('/static/video.mp4')
                        setInputText('曼哈顿 SOHO (WABC)——警方正在追捕四名小偷，他们从 SoHo 的一家商店偷走了大约 50,000 美元的商品，而此时该社区的入室盗窃案呈上升趋势。上周六早上 7 点 30 分左右，几个人用锤子闯入了位于 SoHo 格林街 94 号的纪梵希商店。这就像一场私人购物活动，但没有人付钱。在商店开门前几个小时，小偷就把纪梵希商店完全占为己有')
                      }
                      else if(searchURL.indexOf('american') !== -1) {
                        setVideoURL('/static/video2.mp4')
                        setInputText('警方称，周五，一群武装劫匪从新泽西州的一家珠宝店盗窃。据当局称，涉嫌窃贼戴着口罩和手套，于晚上 7 点 45 分左右尾随一名员工进入商店前门。犯罪嫌疑人将员工逼到地板上，砸碎了几个玻璃陈列柜，并在不到一分钟内逃离了商店，然后将里面的珠宝拿走了。')
                      }
                      setCardLoading(false);
                      setShowElem(true)
                    }, 2000);
   
                }
              }
              >爬取信息</Button>
              </Input.Group>
            </Row>
            </Card>
          </Col>
        </Row>
        { showElem ? (
        <Row justify="center" style={{margin : '10px'}} >
          <Col span={16}>
          <Card title="多模态信息" style={{ borderWidth : '2px', borderColor: '#CCCCCC', borderRadius : '10px', boxShadow: '4px 4px #CCCCCC' }}>
            { inputText &&
              <Row justify="center" gutter={16} style={
                {
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }} >
                <Col span={12}>
                  <TextArea
                    maxLength={1000}
                    value={inputText}
                    width={'100%'}
                    height={'100%'}
                    bordered={false}
                    autoSize={{ minRows: 2, maxRows: 10 }}
                    onChange={e => setInputText(e.target.value)}
                  ></TextArea>
                </Col>
                <Col span={12}>
                  <video src={videoURL} type="video/mp4" width={'100%'} controls="controls" autoPlay="autoPlay">
                  </video>
                </Col>
              </Row>
              }
              <br />
            {
              inputText && <div className="btn-run-wrapper">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<CaretRightOutlined />}
                  onClick={
                 async () => {
                    message.loading("运行中....", 1.8)
                    setTimeout(async () => {
                      message.success("运行成功")
                      setCardLoading(true);
                      try {
                          const rsp = await fetchGraphPage(inputText);
                          setGraphPageLastText(inputText);
                          setGraphPage(rsp.data);
                        } catch (e) {
                          console.error(e);
                          setGraphPageLastText('');
                          setGraphPage(null);
                      }
                    }, 2000);
                    }
                  }
                >
                  运行
                </Button>
              </div>
            }
            </Card>
          </Col>
        </Row>): null
        }
        { showElem ? (
        <Row justify="center" style={{margin : '10px'}}>
          <Col span={16}>
            { <Card style={{  borderWidth : '2px', borderColor: '#CCCCCC', borderRadius : '10px', boxShadow: '4px 4px #CCCCCC'}}
              className="results-card-wrapper"
              title="结果"
              tabList={tabList}
              activeTabKey={activeTabKey}
              onTabChange={ (key) => {

                  setActiveTabKey(key)
              }}
            >
              {activeTabKey === "entity" ? inputText && cardLoading && <EntityContent inputText={inputText} /> : (activeTabKey === "event" ? inputText && cardLoading && <EventContent inputText={inputText} /> : inputText && cardLoading && <GraphContent graphPage={graphPage} inputText={inputText} />)}
            </Card>}
          </Col>
        </Row>): null
        }
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor : '#FFFFFF', color : '#999999' }}></Footer>
    </Layout>
  );
}

export default App;
