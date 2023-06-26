import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar} from 'react-native';
import CurrentPrice from './src/components/CurrentPrice';
import HistoryGraphic from './src/components/HistoryGraphic';
import QuotationsList from './src/components/QuotationsList';



function addZero(number){
  if(number <= 9){
    return "0" + number
  }
  return number
}

function url(qtdDays){
  //https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=2013-09-05
  const date = new Date();
  const listLastDays = qtdDays;
  const endDate = `${date.getFullYear()}-${addZero(date.getMonth()+1)}-${addZero(date.getDate())}`
  date.setDate(date.getDate() - listLastDays)
  const startDate = `${date.getFullYear() - 5}-${addZero(date.getMonth()+1)}-${addZero(date.getDate())}`
  console.log(startDate)
  return `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}`

}
 
async function getListCoins(url) {
  let response = await fetch(url);
  let returnApi = await response.json()
  let selectedListQuotations = returnApi.bpi
  const queryCoinsList = Object.keys(selectedListQuotations).map((key) =>{
    return {
      data: key.split("-").reverse().join("/"),
      valor: selectedListQuotations[key]
    }
  })

  let data = queryCoinsList.reverse();
  return data;

}

async function getPriceCoinsGraphic(url) {
  let responseG = await fetch(url);
  let returnApiG = await responseG.json()
  let selectedListQuotationsG = returnApiG.bpi
  const queryCoinsList = Object.keys(selectedListQuotationsG).map((key)=>{
    return selectedListQuotationsG[key]; 
  });

  let dataG = queryCoinsList;
  return dataG;
}

export default function App() {
  const [coinsList, setCoinsList] = useState([]);
  const [coinsGraphicList, setCoinsGraphicList] = useState([0]);
  const [days, setDays] = useState(30);
  const [updateData, setUpdateData] = useState(true);
  const [price, setPrice] = useState();

  function updateDay(number){
    setDays(number);
    setUpdateData(true);
  }

  function priceCotation(){
    setPrice(coinsGraphicList.pop())
  }

  useEffect(() => {
    getListCoins(url(days)).then((data)=>{
      setCoinsList(data)
    });

    getPriceCoinsGraphic(url(days)).then((dataG)=>{
      setCoinsGraphicList(dataG)
    })
    priceCotation()
    if(updateData){
      setUpdateData(false)
    }
  },[updateData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#f50d41' barStyle='dark-content'/>
      <CurrentPrice lastCotation={price}/>
      <HistoryGraphic infoDataGraphic={coinsGraphicList}/>
      <QuotationsList filterDay={updateDay} listTransaction={coinsList}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? 40: 0
  },
});
