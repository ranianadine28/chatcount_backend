import 'package:flutter/cupertino.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';

class ResponsiveLayout extends StatelessWidget {

  final Widget mobileBody;
  final Widget desktopBody;
  const ResponsiveLayout({required this.mobileBody,required this.desktopBody});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context,constraints){
      if(constraints.maxWidth < 700){
        return mobileBody;
      }else{
        return desktopBody;
      }
    });
  }
}