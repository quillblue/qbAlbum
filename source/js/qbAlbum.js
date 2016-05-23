(function (window) {

    'use strict';
    function qbAlbum(){
    }

    function qbAlbumObj() {
        this.settings={
            layout:1,
            waterfallColumn:4,
            bucketMinHeight:150,
            gutter:[16,16],
            enableFullscreen:false
        };
        this.imgList=[];
    }

    /**
     * Intializing for album
     * @param {string} container  Selector of album container
     * @param {object} option settings for frame intialization
     */
    qbAlbum.prototype.init=function(container,option){
        var albumObj=new qbAlbumObj();
        albumObj.container=document.querySelector(container)
        albumObj.container.classList.add('album')
        if(option!==undefined){
            if(option.waterfallColumn&&!isNaN(parseInt(waterfallColumn))){
                albumObj.settings.waterfallColumn=option.waterfallColumn;
            }
            if(option.bucketMinHeight&&!isNaN(parseFloat(waterfallColumn))){
                albumObj.settings.bucketMinHeight=option.bucketMinHeight;
            }
            if((typeof option.gutter==='number'&&!isNaN(parseFloat(option.gutter)))||(option.gutter.length==2)){
                albumObj.setGutter(option.gutter[0],option.gutter[1])
            }
            if(option.enableFullscreen){
                albumObj.settings.enableFullscreen=option.enableFullscreen
            }
        }
        albumObj.imgList=[]
        var shadowMask=document.createElement('div')
        shadowMask.id='shadowMask'
        document.querySelector('body').appendChild(shadowMask)
        albumObj.setLayout(albumObj.settings.layout)
        window.addEventListener('resize',function(){
            if(albumObj.settings.layout==1){puzzleImgResize(albumObj,true)}
        })
        return albumObj
    }

    /**
     * Refresh album
     */
    qbAlbumObj.prototype.refresh=function(){
        this.setLayout(this.settings.Layout)
        this.setImage(this.imgList)
    }

    /**
     * Set images for album
     * @param {(string|string[])} image  imgUrls
     * @param {object}            option settings for frame intialization
     */
    qbAlbumObj.prototype.setImage = function (image, option) {
        
        if (typeof image === 'string') {
            this.setImage([image]);
            return;
        }
        if(this.settings.layout===1){
            this.container.innerHTML=''
            this.imgList=image
            if(image.length==2){
                this.container.classList.add('album-puzzle-2')
            }
            for(var i=0;i<Math.min(image.length,6);i++){
                var picContainer=document.createElement('div')
                picContainer.className='album-item puzzle-album-item'
                var picDom=document.createElement('img')
                picDom.src=image[i]
                picDom.onload=puzzleImgResize(this)
                picContainer.appendChild(picDom)
                this.container.appendChild(picContainer)
            }
            puzzleResize(this)
        }
        else{
            this.imgList=[]
            this.addImage(image)
        }
    };

    /**
     * Get doms of all images
     * @return {HTMLElement[]}
     */
    qbAlbumObj.prototype.getImageDomElements = function() {
        return this.container.getElementsByClassName('album-item')
    };

    /**
     * Add images to album
     * @param {(string|string[])} image imgUrls
     */
    qbAlbumObj.prototype.addImage = function (image) {
        if(typeof image==='string'){
            this.addImage([image]);
            return;
        }
        this.imgList=this.imgList.concat(image);
        if(this.settings.layout==1){
            if(this.imgList.length>6){
                this.setImage(this.imgList.slice(0,6))
            }
            else{
                this.setImage(this.imgList)
            }
            
        }
        else{
            if(this.settings.layout==2){
                waterfallImageInsert(this,image)
            }
            else{
                bucketImageInsert(this,image)
            }
        }
    };

    /**
     * 移除相册中的图片
     * @param  {(HTMLElement|HTMLElement[])} image 需要移除的图片
     * @return {boolean} 是否全部移除成功
     */
    qbAlbumObj.prototype.removeImage = function (image) {
        var imgContainerList=this.getImageDomElements();
        var newImageList=[];
        for(var i=0;i<imgContainerList.length;i++){
            if(image.indexOf(imgContainerList[i])<0){
                newImageList.push(imgContainerList[i].children[0].src);
            }
            this.setImage(newImageList);
        }
    };

    /**
     * Set layout of the album
     * @param {number} layout
     */
    qbAlbumObj.prototype.setLayout = function (layout) {
        if(layout!=1&&layout!=2&&layout!=3){
            console.error('Layout value is invalid')
            return;
        }
        this.container.innerHTML=''
        this.container.style.display='block'
        if(layout==1){

        }
        else{
            if(layout==2){
                this.container.style.display='flex'
                this.columnHeight=new Array(this.settings.waterfallColumn)
                for(var i=0;i<this.settings.waterfallColumn;i++){
                    var columnDom=document.createElement('div')
                    columnDom.classList.add('waterfall-col')
                    columnDom.style.width=(this.container.clientWidth-0.5-(this.settings.waterfallColumn-1)*this.settings.gutter[0])/this.settings.waterfallColumn+'px';
                    columnDom.style.margin='0 '+this.settings.gutter[0]/2+'px'
                    if(i==0){columnDom.style.marginLeft='0';}
                    if(i==this.settings.waterfallColumn-1){columnDom.style.marginRight='0';}
                    this.container.appendChild(columnDom)
                }
                this.columnHeight=new Array(this.settings.waterfallColumn)
                for(var i=0;i<this.settings.waterfallColumn;i++){
                    this.columnHeight[i]=0;
                }
            }
            else{
                this.currentSpaceLeft=this.container.clientWidth
                this.currentRow=document.createElement('div')
                this.currentRow.classList.add('bucket-row')
                this.currentRow.style.marginBottom=this.settings.gutter[1]+'px'
                this.currentRow.style.height=this.settings.bucketMinHeight+'px'
                this.container.appendChild(this.currentRow)
            }
        }
        this.settings.layout=layout
    };

    /**
     * Get current Layout
     * @return {number}
     */
    qbAlbumObj.prototype.getLayout = function() {
        return this.settings.layout
    };

    /**
     * Set column number for waterfall album
     * @param {number}  colNumber  Counts of columns in waterfall album
     */
    qbAlbumObj.prototype.setWaterfallColumn = function (count) {
        if(!isNaN(parseInt(count)&&parseInt(count)>0)){
            this.settings.waterfallColumn=parseInt(count)
        }
    };

    /**
     * Set minHeight of row for bucket album
     * @param {number}  minHeight
     */
    qbAlbumObj.prototype.setBucketMinHeight = function (minHeight) {
        if(!isNaN(parseFloat(minHeight)&&parseFloat(minHeight)>0)){
            this.settings.bucketMinHeight=parseFloat(minHeight)
        }
    };

    /**
     * Set margin between images
     * @param {number}  x  Horizontal margin between images
     * @param {number} [y] Vertical margin between images, same as x by default
     */
    qbAlbumObj.prototype.setGutter = function (x, y) {
        if(y===undefined){y=x;}
        if(x===undefined||isNaN(parseFloat(x))||isNaN(parseFloat(y))){
            console.error('Gutter is invalid')
        }
        this.settings.gutter=[x,y]
    };

    /**
     * Enable full screen view
     */
    qbAlbumObj.prototype.enableFullscreen = function () {
        this.settings.enableFullscreen=true;
    };

    /**
     * Disable full screen view
     */
    qbAlbumObj.prototype.disableFullscreen = function () {
        this.settings.enableFullscreen=false;
    };

    /**
     * Get whether full screen view is enabled
     * @return {boolean} Whether full screen view is enabled
     */
    qbAlbumObj.prototype.isFullscreenEnabled = function () {
        return this.settings.enableFullscreen;
    };

    //Private functions here
    var puzzleResize=function(albumObj,isImgLoaded){
        var sizes=puzzleGetSize(albumObj,albumObj.imgList.length)
        var picContainers=albumObj.container.children;
        for(var i=0;i<Math.min(albumObj.imgList.length,6);i++){
            picContainers[i].style.height=sizes[i].height+'px'
            picContainers[i].style.width=sizes[i].width+'px'
            if(sizes[i].right){
                picContainers[i].style.float='right'
            }
            if(isImgLoaded){
                var img=picContainers[i].children[0]
                if(img.originalHeight/img.originalWidth<sizes[i].height/sizes[i].width){
                    img.style.width=''
                    img.style.height='100%'
                    img.style.left=(sizes[i].width-img.originalWidth*sizes[i].height/img.originalHeight)/2+'px'
                    img.style.top='0px'
                }
                else{
                    img.style.height=''
                    img.style.width='100%'
                    img.style.top=(sizes[i].height-img.originalHeight*sizes[i].width/img.originalWidth)/2+'px'
                    img.style.left='0px'
                }
            }
        }
    }

    var puzzleImgResize=function(albumObj){
        var container=albumObj.container
        albumObj.originalHeight=container.clientHeight
        albumObj.originalWidth=container.clientWidth
        if(albumObj.clientHeight/albumObj.clientWidth<container.clientHeight/container.clientWidth){
            albumObj.container.style.height='100%'
            albumObj.container.style.left=(container.clientWidth-albumObj.clientWidth)/2+'px'
        }
        else{
            albumObj.container.style.width='100%'
            albumObj.container.style.top=(container.clientHeight-albumObj.clientHeight)/2+'px'
        }
    }

    var puzzleGetSize=function(albumObj){
        var sizes=[]
        var height=albumObj.container.clientHeight-0.5
        var width=albumObj.container.clientWidth-0.5
        switch(Math.min(albumObj.imgList.length,6)){
            case 1:sizes=[{height:height,width:width}];break;
            case 2:sizes=[{height:height,width:width/3*2},{height:height,width:width/3*2,right:true}];break;
            case 3:sizes=[{height:height,width:width-height/2},{height:height/2,width:height/2},{height:height/2,width:height/2}];break;
            case 4:sizes=[{height:height/2,width:width/2},{height:height/2,width:width/2},{height:height/2,width:width/2},{height:height/2,width:width/2}];break;
            case 5:
                sizes=[{height:height/3*2,width:width/3*2},{height:width/3,width:width/3,right:true},{height:height-width/3,width:width/3,right:true},{height:height/3,width:width/3},{height:height/3,width:width/3}];
                if (width > height * 2) {
                    sizes.push(sizes.splice(2, 1)[0])
                }
                break;
            case 6:sizes=[{height:height/3*2,width:width/3*2},{height:height/3,width:width/3},{height:height/3,width:width/3},{height:height/3,width:width/3},{height:height/3,width:width/3},{height:height/3,width:width/3}];break;
        }
        return sizes;
    }

    var waterfallImageInsert=function(albumObj,imgList,index){
        //Load Image
        if(!index){index=0}
        if(index>=imgList.length){return;}
        var pic=new Image()
        pic.src=imgList[index]
        var set=setInterval(function(){
            //If Got the width or height from server, deal with image inserting
            if(pic.width>0||pic.height>0){
                var colIndex=albumObj.columnHeight.indexOf(albumObj.columnHeight.reduce(function(a,b){return a<b?a:b}))
                var targetCol=albumObj.container.children[colIndex]
                var albumItem=document.createElement('div')
                albumItem.classList.add('album-item')
                var picDom=document.createElement('img')
                picDom.src=imgList[index]
                picDom.addEventListener('click',function(){
                    if(albumObj.settings.enableFullscreen){
                        var shadowMask=document.getElementById('shadowMask')
                        shadowMask.style.display='flex'
                        shadowMask.innerHTML='<img src="'+this.src+'" />'
                        shadowMask.addEventListener('click',function(){
                            this.style.display='none'
                        })
                    }
                })
                picDom.style.marginBottom=albumObj.settings.gutter[1]+'px'
                albumItem.appendChild(picDom)
                targetCol.appendChild(albumItem)
                albumObj.columnHeight[colIndex]+=albumItem.clientHeight

                clearInterval(set)
                index++
                waterfallImageInsert(albumObj,imgList,index)
            }
        },40)
    }

    var bucketImageInsert=function(albumObj,imgList,index){
        if(!index){index=0}
        if(index>=imgList.length){return;}
        var pic=new Image()
        pic.src=imgList[index]
        var set=setInterval(function(){
            //If Got the width or height from server, deal with image inserting
            if(pic.width>0||pic.height>0){
                if(albumObj.currentSpaceLeft-pic.width*albumObj.settings.bucketMinHeight/pic.height<0){
                    //This row is full, will wrap it up and set up another
                    albumObj.currentRow.style.height=albumObj.settings.bucketMinHeight/(albumObj.container.clientWidth-albumObj.currentSpaceLeft)*albumObj.container.clientWidth+'px'
                    albumObj.currentRow=document.createElement('div')
                    albumObj.currentRow.classList.add('bucket-row')
                    albumObj.currentRow.style.height=albumObj.settings.bucketMinHeight+'px'
                    albumObj.currentRow.style.marginBottom=albumObj.settings.gutter[1]+'px'
                    albumObj.container.appendChild(albumObj.currentRow)
                    albumObj.currentSpaceLeft=albumObj.container.clientWidth
                }
                //Add the image to this row and recalculate the space left
                var picContainer=document.createElement('div')
                picContainer.classList.add('bucket-item')
                var picDom=document.createElement('img')
                picDom.src=imgList[index]
                picDom.addEventListener('click',function(){
                    if(albumObj.settings.enableFullscreen){
                        var shadowMask=document.getElementById('shadowMask')
                        shadowMask.style.display='flex'
                        shadowMask.innerHTML='<img src="'+this.src+'" />'
                        shadowMask.addEventListener('click',function(){
                            this.style.display='none'
                        })
                    }
                })
                picContainer.appendChild(picDom)
                albumObj.currentRow.appendChild(picContainer)
                albumObj.currentSpaceLeft-=pic.width*albumObj.settings.bucketMinHeight/pic.height

                clearInterval(set)
                index++
                bucketImageInsert(albumObj,imgList,index)
            }
        },40)
    }

    if (typeof window.qbAlbum === 'undefined') {
        window.qbAlbum = new qbAlbum();
    }

}(window));