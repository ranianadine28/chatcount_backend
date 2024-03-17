import 'package:flutter/material.dart';
import 'package:psychoday/utils/style.dart';

class Background extends StatelessWidget {
  final Widget child;
  final Color bg;
  const Background({
    Key? key,
    required this.child,
    required this.bg,
    this.topImage = "Assets/images/main_top.png",
    this.topImageWhite="Assets/images/main_top_white.png",
    this.bottomImage = "Assets/images/login_bottom.png",
  }) : super(key: key);

  final String topImage, bottomImage, topImageWhite;

  @override
  Widget build(BuildContext context) {
    const Color whiteColor = Color(0xFFFFFFFF);
    String bgImage;
    if(bg == whiteColor){
      bgImage=topImageWhite;
    }else{
      bgImage=topImage;
    }
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Container(
        decoration: BoxDecoration(color: bg),
        width: double.infinity,
        height: MediaQuery.of(context).size.height,
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            Positioned(
              top: 0,
              left: 0,
              child: Image.asset(
                bgImage,
                width: 120,
              ),
            ),
            // Positioned(
            //   bottom: 0,
            //   right: 0,
            //   child: Image.asset(bottomImage, width: 120),
            // ),
            SafeArea(child: child),
          ],
        ),
      ),
    );
  }
}
