// ignore_for_file: non_constant_identifier_names

import 'package:flutter/material.dart';

import 'package:oort_studios_website/bar.dart';

class Home extends StatelessWidget 
{
    @override
    Widget build(BuildContext context) 
    {
        return Scaffold(
            backgroundColor: Color.fromARGB(255, 0, 0, 0),
            appBar: MenuBar(context)
        );
    }
}