var i = 0;
var j = 0;

function loadTrack(data){
    var url = data.src

    var audio_fx = null
    audio_fx = document.createElement('audio')
    audio_fx.setAttribute('src',url)
    audio_fx.load()
    audio_fx.addEventListener('loadeddata',function(){
        //alert("cargo")
        data.callBack(audio_fx)
    })
    audio_fx.addEventListener('error',function(){
        console.log("error cargando")
        data.callBack(null)
    })
}

function getE(idname){
    return document.getElementById(idname)
}

function loadMask(){
    loadMaskImg()
}

var mask_i = 1
function loadMaskImg(){
    if(mask_i>15){
        loadImg({src:'assets/images/bandera-col.png', callBack: function(){
            setMaskImagen('colombia','col')
            loadImg({src:'assets/images/bandera-ext.png', callBack: function(){
                setMaskImagen('extranjero','ext')
                loadImg({src:'assets/images/bandera-ven.png', callBack: function(){
                    setMaskImagen('venezuela','ven')

                    //overBandera(document.getElementsByClassName('bandera-zona')[1],'extranjero',1)
                    unsetLoader()
                    intro_mp3.play()
                    clickSonido()
                }})
            }})
        }})
    }else{
        loadImg({src:'assets/images/bandera-mask/'+mask_i+'.svg', callBack: function(){
            mask_i++
            loadMaskImg()
        }})
    }
}

function setMaskImagen(flag,miniflag){
    var bandera_image_cont = getE('bandera-fondo-'+flag)
    for(i = 0;i<15;i++){
        var div_mask = document.createElement('div')
        div_mask.style.backgroundImage = 'url(assets/images/bandera-'+miniflag+'.png)'
        div_mask.style.maskImage = 'url(assets/images/bandera-mask/'+(i+1)+'.svg)'
        div_mask.style.visibility = 'hidden'
        bandera_image_cont.appendChild(div_mask)
    }
}

var animacion_mascara = null;
var animacion_mascara_i = 1;
var animating_mascara = false;
var bandera_actual = ''
var bandera_actual_pos = -1

function setAnimationmask(f){
    var bandera_image_cont = getE('bandera-fondo-'+bandera_actual)
    for(j = 0;j<bandera_image_cont.getElementsByTagName('div').length;j++){
        bandera_image_cont.getElementsByTagName('div')[j].style.visibility = 'hidden'
    }
    bandera_image_cont.getElementsByTagName('div')[f-1].style.visibility = 'visible'
}

function animarMascara(){
    animacion_mascara = setInterval(function(){
        setAnimationmask(animacion_mascara_i)
        
        animacion_mascara_i++;
        if(animacion_mascara_i>15){
            animacion_mascara_i = 4;
        }
    },70)
}

function overBandera(zona,flag,pos){
    if(!animating_mascara){
        animating_mascara = true;
    
        bandera_actual = flag;
        bandera_actual_pos = pos
        animacion_mascara_i = 1;
    
        var bandera_parent = zona.parentNode
        bandera_parent.className = 'bandera-container bandera-over'
    
        setAnimationmask(animacion_mascara_i)
        setAnimationFrame(pos,1)
        animarMascara()
    
        playAnimation(bandera_actual_pos,1,15,false,function(){
            playAnimation(bandera_actual_pos,4,-1,false,null,70)
        },70)

        flag2_mp3.currentTime = 0;
        flag2_mp3.play();
        //flag3_mp3.currentTime = 0;
        //flag3_mp3.play();
    }
}

function outBandera(zona){
    if(animating_mascara){
        clearInterval(animacion_mascara)
        animacion_mascara = null

        animacion_mascara_i = 3
    
        var bandera_parent = zona.parentNode
        bandera_parent.className = 'bandera-container bandera-normal'
    
        stopAnimation(bandera_actual_pos)
        bandera_actual_pos = -1
        bandera_actual = ''

        animating_mascara = false;
        flag3_mp3.pause();
    }
}

var active_card = false;
var animating_mujer = false;

function clickBandera(flag){
    if(!animating_mujer){
        animating_mujer = true;
        
        if(!active_card){
            setCard(flag,1)
            active_card = true;
        }else{
            getE('card').className = 'card-off'
            playAnimation(3,73,23,true,function(){
                setCard(flag,23)
                active_card = true;
            },40)
        }

        click_mp3.currentTime = 0;
        click_mp3.play()
    }
}

var global_audio = null;
function setCard(flag,pos){
    if(global_audio!=null){
        global_audio.pause()
    }
    intro_mp3.pause()

    var contenidos = getE('card').getElementsByClassName('content')
    for(i = 0;i<contenidos.length;i++){
        contenidos[i].style.display = 'none'
    }
    contenidos[flag].style.display = 'block'

    getE('card').className = 'card-on'
    playAnimation(3,pos,0,false,function(){
        animating_mujer = false;
    },40)

    if(flag==0){
        global_audio = colombia_mp3
    }else if(flag==1){
        global_audio = extranjero_mp3
    }else if(flag==2){
        global_audio = venezuela_mp3
    }

    global_audio.currentTime = 0
    global_audio.play()
}

function cerrarCard(){
    animating_mujer = true;
    if(global_audio!=null){
        global_audio.pause()
        global_audio = null
    }
    getE('card').className = 'card-off'
    stopAnimation(3)
    playAnimation(3,73,0,true,function(){
        animating_mujer = false;
        active_card = false;
    },40)
}