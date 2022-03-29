// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';

import 'package:oort_studios_website/home.dart';
import 'package:oort_studios_website/global.dart' as Global;

void main() => runApp(OortWebsite());

class OortWebsite extends StatefulWidget 
{
    @override
    State<OortWebsite> createState() => _OortWebsiteState();
}

class _OortWebsiteState extends State<OortWebsite> 
{
    @override
    Widget build(BuildContext context) 
    {
        return MaterialApp(
            title: "Oort Studios | ${Global.NamedCurrentRoute}",
            home: Navigator(
                onPopPage: (route, result) 
                {
                    if (!route.didPop(result)) return false;
                    return true;
                },
                pages: [
                    MaterialPage(child: Home())
                ]   
            )
        );
        
    }
}