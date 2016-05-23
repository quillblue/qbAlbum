var albumObj=qbAlbum.init('#example')
		function loadImg(count){
			var colors=['C23531','2F4554', '61A0A8', 'D48265', '91C7AE','749F83',  'CA8622', 'BDA29A','6E7074', '546570', 'C4CCD3']
			var imgList=[]
			for(var i=0;i<count;i++){
				var color=colors[parseInt(Math.random()*10)]
				var width=parseInt(Math.random()*40+20)*10
				var height=parseInt(Math.random()*40+20)*10
				imgList.push('http://placehold.it/'+width+'x'+height+'/'+color+'/fff')
			}
			return imgList
		}
		var imgList=loadImg(8)
		albumObj.setImage(imgList)
		var btnUpdate=document.getElementById('btnUpdate')
		btnUpdate.addEventListener('click',function(){
			if(document.getElementById('fullScreenViewEnabled').checked){
				albumObj.enableFullscreen()
			}
			else{
				albumObj.disableFullscreen()
			}
			albumObj.setGutter(document.getElementById('gutterX').value,document.getElementById('gutterY').value)
			albumObj.setWaterfallColumn(document.getElementById('waterfallColumns').value)
			albumObj.setBucketMinHeight(document.getElementById('bucketMinHeight').value)
			albumObj.setLayout(parseInt(document.getElementById('layout').value))
			albumObj.refresh()
		})
		var btnAdd=document.getElementById('btnAdd')
		btnAdd.addEventListener('click',function(){
			var addCount=parseInt(document.getElementById('inputAddCount').value)
			if(!isNaN(addCount)&&addCount>0){
				var newImgList=loadImg(addCount)
				albumObj.addImage(newImgList)
			}
		})
		var btnDelete=document.getElementById('btnDelete')
		btnDelete.addEventListener('click',function(){
			var deleteCount=parseInt(document.getElementById('inputDelCount').value)
			if(!isNaN(deleteCount)&&deleteCount>0){
				if(albumObj.imgList.length<=deleteCount){
					albumObj.setImage([])
				}
				else{
					albumObj.setImage(albumObj.imgList.slice(0,albumObj.imgList.length-deleteCount))
				}
			}
		})