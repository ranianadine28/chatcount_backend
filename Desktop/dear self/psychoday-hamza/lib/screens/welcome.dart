import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:lottie/lottie.dart';
import 'package:psychoday/screens/Welcome/components/login_signup_btn.dart';
import 'package:psychoday/screens/Welcome/welcome_screen.dart';
import 'package:psychoday/utils/responsives/responsive_layout.dart';
import 'package:psychoday/utils/style.dart';

class Welcome extends StatefulWidget {
  const Welcome({super.key});

  @override
  State<Welcome> createState() => _WelcomeState();
}

class _WelcomeState extends State<Welcome> {

  final List<List<String>> services=[
    [
      "Assets/animations/hellobot.json",
      "Hello!",
      "Hello to your doctor remote folow-up"
    ],
    [
      "Assets/animations/emotion.json",
      "Services",
      "Remote follow-up with your doctor"
    ],
  ];


  int currentIndex = 0;
   
  void _next(){
    setState(() {
      if(currentIndex < services.length -1){
        currentIndex++;
      }else{
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) =>  const WelcomeScreen()));
      }
    });
  }

  void _prev(){
    setState(() {
      if(currentIndex > 0){
        currentIndex--;
      }else{
        currentIndex=0;
      }
    });
  }


  @override
  Widget build(BuildContext context) {
    final currentWidth=MediaQuery.of(context).size.width;
    final currentHeight=MediaQuery.of(context).size.height;

    
    
    return ResponsiveLayout(
        desktopBody: Scaffold(
          appBar: AppBar(
            title: const Text("DESKTOP"),
          ),

          body: Center(
            child:Text("width = " + currentWidth.toString()),
          ),
        ),
        mobileBody:Scaffold(
          body: GestureDetector(
            onHorizontalDragEnd:(DragEndDetails details){
                if(details.velocity.pixelsPerSecond.dx > 0){
                  _prev();
                }else if (details.velocity.pixelsPerSecond.dx < 0){
                  _next();
                }
              },
            child: Column(
              children: [
                //skip
                Container(
                  padding: EdgeInsets.all(20),
                  height: currentHeight/12,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        width: currentWidth/6,
                        height: 50,
                        decoration: BoxDecoration(color: Style.secondLight,borderRadius:BorderRadius.circular(5)),
                        child: Center(
                          child: InkWell(
                            onTap: () {
                              Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) =>  const WelcomeScreen()));
                            },
                            child: const Text("Skip",style: TextStyle(color: Style.primaryLight,fontFamily: 'Mark-Light',fontSize: 17),),
                          ),
                        ),
                      )
                    ],
                  ),
                ),


                Container(
                  height: currentHeight-((currentHeight/4)+(currentHeight/12)+(currentHeight/12) ),
                  child: Center(
                    child: Lottie.asset(services[currentIndex][0], repeat: true,reverse: true,fit:BoxFit.cover),
                  ),
                ),

                Container(
                  height: currentHeight/4,
                  child: Row(
                    children: [
                      Container(
                        width: currentWidth/6,
                        child: Center(
                          child:InkWell(
                              child:const Icon(Icons.arrow_back_ios,color: Style.primaryLight,) ,
                              onTap: () {
                                _prev();
                              },
                            ),
                        ),
                      ),

                      
          
                      Container(
                        width: currentWidth-(currentWidth/6)*2,
                        padding: EdgeInsets.all(30),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            SizedBox(
                              height: currentHeight/12,
                              child: Text(services[currentIndex][1],style: const TextStyle(color: Style.primary,fontSize: 25, fontStyle:FontStyle.normal,fontWeight:FontWeight.bold,fontFamily: 'Red Ring'),)) ,
                            Text(services[currentIndex][2],textAlign: TextAlign.center,style: const TextStyle(color: Style.primary,fontSize: 20,fontStyle: FontStyle.normal,fontFamily: 'Mark-Light'),),

                          ],
                        ),
                      ),


                      
          
                      Container(
                        width: currentWidth/6,
                        child: Center(
                          child:InkWell(
                              child:const Icon(Icons.arrow_forward_ios,color: Style.primaryLight,),
                              onTap: () {
                                _next();
                              },
                            ),
                        ),
                      ),
                    ],
                  ),
                ),
          
          
                Container(
                  height:currentHeight/12,
                  child:Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Container(
                          width: currentWidth/4,
                          margin: const EdgeInsets.only(bottom: 20),
                          child: Row(
                                    children:_buildIndicator(),
                                  ),
                        )
                      ],
                      ),
                ),
          
                
              ],
            ),
          ),
        ),
        );
  }



  Widget _indicator(bool isActive){
    return Expanded(
      
      child: Container(
        height: 4,
        margin: const EdgeInsets.only(right: 5),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(50) ,
          color: isActive ? Style.primaryLight : Style.second,
        ),
      ) ,
      );
  }


  List<Widget> _buildIndicator() {
    List<Widget> indicators=[];
    for(int i = 0 ; i < services.length;i++){
      if(currentIndex == i){
        indicators.add(_indicator(true));
      }else{
        indicators.add(_indicator(false));
      }
    }

    return indicators;
  }
}