import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View, Image } from 'react-native'

const Api = () => {
    const [dataUser, setDataUser] = useState ({
        avatar : 'avaa\tar',
        email: 'aaaaa',
        first_name : 'bbbb',
        last_name : 'cccc'
    })

    const getData = () => {
        // Axios({
        //     method: 'post',
        //     url: 'https://admin.belogherbal.com/api/open/login',
        //     data: {
        //       email: 'putualgoritma@gmail.com',
        //       password: '123456'
        //     },
        //     headers : {
        //         'Accept': 'application/json',

        //     }
        //   }).then((res) => {
        //       console.log(res)
        //   })
        Axios.post('https://admin.belogherbal.com/api/open/login', {
            email : 'putualgoritma@gmail.com',
            password : '123456'
        },
        {
            headers : {
                'Accept' : 'application/json'
            }
        }).then((res) => console.log(res))
    }

    const [dataJob, setDataJob] = useState({
        name : '',
        job : '',
    })

    const postData = () => {
        const dataForAPI = {
                    name : 'morpheus',
                    job : 'leader'
                }
        
            //     console.log('data object : ', dataForAPI)
            //     console.log('data oject stringIfy', JSON.stringify(dataForAPI))
            // //     // console.log('data stringify : ' , Json.stringify(dataForAPI))
            //     fetch('https://reqres.in/api/users', {
            //         method : 'POST',
            //         headers : {
            //             'Content-Type' : 'application/json'
            //         },
            //         body: JSON.stringify(dataForAPI)
            //     })
        
            //     .then(response => response.json())
            //     .then(json => {
            //         console.log('post response : ', json)
            //         setDataJob(json)
            //     })

            Axios.post('https://reqres.in/api/users', dataForAPI)
            .then(result => {
                console.log('result :' , result)
                setDataJob(result.data)
            })
            .catch(err => console.log('err :' , err))
    }

    return (
        <View style = {styles.container}>
            <Text style={styles.textTtitle} >Call API Axios</Text>
            <Button title='GET DATA' onPress ={getData} />
            <Text>Response Data</Text>
            <Image source= {{uri : dataUser.avatar}}  style ={{width : 150, height:150, borderRadius : 100}}/>
            {/* <Text>{`${dataUser.first_name} ${dataUser.last_name}`}</Text> */}
                <Text>{dataUser.first_name} {dataUser.last_name}</Text>
            <Text>{dataUser.email}</Text>
            <View style ={styles.line}></View>   
            <Button title='POST DATA' onPress ={postData} />
            <Text>Response Data</Text>
            <Text>{dataJob.name}</Text>
            <Text>{dataJob.job}</Text>
            <View style ={styles.line}></View>     
        </View>
    )
}

export default Api

const styles = StyleSheet.create({
    container : {
        padding : 20
    },
    textTtitle :{
        textAlign : 'center'
    },
    line:{
        height :2,
         backgroundColor:'black',
         marginVertical : 10
    }
})
