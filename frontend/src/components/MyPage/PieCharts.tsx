import React from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {PieChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// props 타입 정의!
interface PieChartsProps {
  success: number;
  stoped: number;
  fail: number;
}

const PieCharts = ({success, stoped, fail}: PieChartsProps) => {
  const total = success + stoped + fail;
  const percent = total === 0 ? 0 : Math.round((success / total) * 100);

  const data = [
    {
      name: '성공',
      population: success,
      color: '#17A34A',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: '중단',
      population: stoped,
      color: '#CA8A03',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: '실패',
      population: fail,
      color: '#DC2625',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <ChartContainer>
      <ChartWrapper>
        <PieChart
          data={data}
          width={screenWidth - 80}
          height={200}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor={'population'}
          backgroundColor={'transparent'}
          center={[82, 0]}
          hasLegend={false}
          absolute
          paddingLeft="0"
        />
        <CenterHole>
          <PercentText>{percent}%</PercentText>
          <LabelText>성공률</LabelText>
        </CenterHole>
      </ChartWrapper>
    </ChartContainer>
  );
};

const ChartContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

const ChartWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CenterHole = styled.View`
  position: absolute;
  width: 120px;
  height: 120px;
  background-color: #fff;
  border-radius: 180px;
  align-items: center;
  justify-content: center;
`;

const PercentText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #000;
`;

const LabelText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #555;
`;

export default PieCharts;
