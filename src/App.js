import React, { useState } from 'react';
import { Layout, Row, Col, Input, Card, Button, Empty, Upload, Image, Spin, Avatar, message} from 'antd';

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
  if (props.inputText && props.inputText.indexOf("一群武装劫匪") !== -1) {
    src = "/sample1.html";
    src2 = "/static/ner1.html";
    src3 = "/static/image1.png"
  } else if (props.inputText && props.inputText.indexOf("警方正在追捕四名小偷")) {
    src = "/sample2.html";
    src2 = "/static/ner2.html";
    src3 = ''
  }
  

  return (
    src === null ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
      <div className="entity-content-wrapper">
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="OpenKS领域实体识别模块"
            description="DomainEntityExtractPaddle.entity_lst(Args)"
          />
        </Card>
        <iframe className="entity-content-iframe" src={src2}></iframe>
        <iframe className="entity-content-iframe" src={src}></iframe>
        
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="图片实体识别"
            description="DomainEntityExtractPaddle.entity_lst(Args)"
          />
        </Card>
        <Row gutter={10}>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src3} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src3} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src3} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
        </Row>
        
          <br/><br/><br/>
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="图片关系识别"
            description="DomainEntityExtractPaddle.entity_lst(Args)"
          />
        </Card>
        <Row gutter={10}>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src3} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src3} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src3} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
        </Row>

      </div>
    )
  );
}

function EventContent(props) {
  let src = null;
  let src2 = null;

  if (props.inputText && props.inputText.indexOf("一群武装劫匪") !== -1) {
    src = "/static/event1.html";
    src2 = "/static/image1.png";
  } else if (props.inputText && props.inputText.indexOf("警方正在追捕四名小偷")) {
    src = "/static/event2.html";
    src2 = "";
  }

  return (
    src === null ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
      <div className="event-content-wrapper">
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="OpenKS事件抽取模块"
            description="EventExtractionPaddle(event)"
          />
        </Card>
        <iframe className="event-content-iframe" src={src} scrolling="no"></iframe>
        <Card className="algorithm-card">
          <Meta
            avatar={<Avatar src="/static/logo.png" />}
            title="图片关系识别"
            description="DomainEntityExtractPaddle.entity_lst(Args)"
          />
        </Card>
        <Row gutter={10}>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src2} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src2} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
          <Col span={8}>
          <Card
            style={{
              width: '100%',
            }}
            cover={<img alt="example" src={src2} />}
            >
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          </Col>
        </Row>
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

  return (
    <div className="graph-content-wrapper">
      <Card className="algorithm-card">
        <Meta
          avatar={<Avatar src="/static/logo.png" />}
          title="OpenKS概念（上位词）挖掘模块"
          description="HypernymExtractPaddle.entity2hyper_lst(entity)"
        />
      </Card>
      <Card className="algorithm-card">
        <Meta
          avatar={<Avatar src="/static/logo.png" />}
          title="OpenKS上下位关系检测模块"
          description="HypernymDiscoveryPaddle(HypernymDiscoveryModel)"
        />
      </Card>
      <Card className="algorithm-card">
        <Meta
          avatar={<Avatar src="/static/logo.png" />}
          title="OpenKS视觉实体链接模块"
          description="VisualEntityLinking(image, text)"
        />
      </Card>
      {
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
      }
      {
        props.graphPage === null ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
          <iframe id="graph-content-iframe" srcDoc={props.graphPage} onLoad={e => {
            setTimeout(() => e.target.contentWindow.comp_graphs(), 1);
          }}></iframe>
        )
      }
      {
        props.graphPage && (
          <div id="div0">
            <div id="bigcilin">
              <div id="entity0"></div>
              <div id="entity1"></div>
              <div id="entity2"></div>
            </div>
          </div>
        )
      }
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
        <Row justify="center" style={{margin : '10px', display: 'flex'}}>
          <Col span={16}>
            <Card title="输入多模态信息" style={{ borderWidth : '2px', borderColor: '#CCCCCC', borderRadius : '10px', boxShadow: '4px 4px #CCCCCC' }}>
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
              <Button type="primary" 
                style={{
                  width: '100px',
                }}
                onClick={
                  () => {
                    if(searchURL.indexOf('1') != -1) {
                      setVideoURL('/static/video.mp4')
                      setInputText('曼哈顿 SOHO (WABC)——警方正在追捕四名小偷，他们从 SoHo 的一家商店偷走了大约 50,000 美元的商品，而此时该社区的入室盗窃案呈上升趋势。上周六早上 7 点 30 分左右，几个人用锤子闯入了位于 SoHo 格林街 94 号的纪梵希商店。这就像一场私人购物活动，但没有人付钱。在商店开门前几个小时，小偷就把纪梵希商店完全占为己有')
                    }
                    else if(searchURL.indexOf('2') != -1) {
                      setVideoURL('/static/video2.mp4')
                      setInputText('警方称，周五，一群武装劫匪从新泽西州的一家珠宝店盗窃。据当局称，涉嫌窃贼戴着口罩和手套，于晚上 7 点 45 分左右尾随一名员工进入商店前门。犯罪嫌疑人将员工逼到地板上，砸碎了几个玻璃陈列柜，并在不到一分钟内逃离了商店，然后将里面的珠宝拿走了。')
                    }
                }
              }
              >Submit</Button>
            </Input.Group>
            </Row>
            <Row justify="center" gutter={16} >
              <Col span={12}>
                <TextArea
                  showCount
                  maxLength={1000}
                  value={inputText}
                  Rows={5}
                  onChange={e => setInputText(e.target.value)}
                ></TextArea>
              </Col>
              <Col span={12}>
                <video src={videoURL} type="video/mp4" width={'100%'} height={'100%'} controls Rows={10}>
                </video>
              </Col>
            </Row>
            
              <br />
              <div className="btn-run-wrapper">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<CaretRightOutlined />}
                  onClick={
                    () => {
                      setCardLoading(true);
                    }
                  }
                >
                  运行
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
        <Row justify="center" style={{margin : '10px'}}>
          <Col span={16}>
            { <Card style={{  borderWidth : '2px', borderColor: '#CCCCCC', borderRadius : '10px', boxShadow: '4px 4px #CCCCCC'}}
              className="results-card-wrapper"
              title="结果"
              tabList={tabList}
              activeTabKey={activeTabKey}
              onTabChange={async (key) => {
                  if (key === "graph" && graphPageLastText !== inputText) {
                    try {
                      const rsp = await fetchGraphPage(inputText);
                      setGraphPageLastText(inputText);
                      setGraphPage(rsp.data);
                    } catch (e) {
                      console.error(e);
                      setGraphPageLastText('');
                      setGraphPage(null);
                    }
                  }
                  setActiveTabKey(key)
              }}
            >
              {activeTabKey === "entity" ? inputText && cardLoading && <EntityContent inputText={inputText} /> : (activeTabKey === "event" ? inputText && cardLoading && <EventContent inputText={inputText} /> : inputText && cardLoading && <GraphContent graphPage={graphPage} />)}
            </Card>}
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor : '#FFFFFF', color : '#999999' }}>Copyright © 2022量知数据研发出品</Footer>
    </Layout>
  );
}

export default App;
