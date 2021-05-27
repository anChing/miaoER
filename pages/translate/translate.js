/*
 * @Author: your name
 * @Date: 2021-05-26 16:07:26
 * @LastEditTime: 2021-05-26 20:42:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \miaoER\pages\translate\translate.js
 */
// pages/translate/translate.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        collect: false,
        ToView: "",
        episode: {},
        uid:0,
        eid:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        var that = this
        wx.getStorage({
            key: 'uid',
            success: (res) => {
                console.log(res.data)
                options.uid = res.data

                console.log(options.uid)
                    // var eid = 1;
                    // var uid = 1;
                wx.request({
                    url: 'https://wx.bitaxes.com/api/episode/' + options.eid + '/' + options.uid,
                    method: 'GET',
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        if(res.data.data.has_star){
                            that.setData({
                                collect: true
                            })
                        }
                        that.setData({
                            episode: res.data.data,
                            uid: parseInt(options.uid),
                            eid: options.eid
                        })
                        // wx.setStorage({
                        //     key: "Episode",
                        //     data: res.data.data
                        // })
                        console.log(res.data)
                        console.log(that.data)
                    }
                })
            },
            fail: () => {
                console.log('not get uid')
            }
        })
    },

    syncEpisode: function(e) {
        console.log(e)
        
        if (e.has_star) {
            this.setData({
                episode: e,
                collect: true
            })
        }else{
            this.setData({
                episode: e,
                collect: false
            })
        }
    },

    changeCollect: function() {
        var that = this
        // if (this.data.collect) {
        //     this.setData({
        //         collect: false
        //     })
        // } else {
        //     this.setData({
        //         collect: true
        //     })
        // }
        console.log(that.data)
        if(this.data.collect){
            wx.request({

                url: 'https://wx.bitaxes.com/api/episode/star', 
                method: 'POST',
                header: {
                  'content-type': 'application/json' 
                },
                data:{
                  "uid": that.data.uid,
                  "eid": that.data.eid,
                },
                success(res) {
                    var epi = that.data.episode
                    epi.has_star = 0
                    that.setData({
                        collect: false,
                        episode: epi
                    })
                  console.log(res.data)
                }
              })
        }else{

            wx.request({

                url: 'https://wx.bitaxes.com/api/episode/star', 
                method: 'POST',
                header: {
                  'content-type': 'application/json' 
                },
                data:{
                  "uid": that.data.uid,
                  "eid": that.data.eid,
                },
                success(res) {
                    var epi = that.data.episode
                    epi.has_star = 1
                    that.setData({
                        collect: true,
                        episode: epi
                    })
                  console.log(res.data)
                }
              })
          

        }
    },
    changeposition: function() {
        this.setData({
            ToView: "header"
        })
    },
    clickStar:function(e){
        console.log(e)
    },
    changePattern:function(e){
        console.log(e)
        wx.setStorage({
            key: "AnsEpisode",
            data: this.data.episode
        })
        // wx.setStorage({
        //     key: "Answer",
        //     data: this.data.Answer
        // })
        wx.navigateTo({
            url: '../Ans/Ans?eid=' + this.data.eid + '&uid=' + this.data.uid,
        })
    },
    onunload: function() {
        wx.removeStorageSync('AnsEpisode');
    },
})