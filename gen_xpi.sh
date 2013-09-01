#!/bin/sh

RDF="install.rdf"
VERSION=`grep version $RDF | cut -d">" -f2 | cut -d"<" -f1 | tr -d '\n'`
PACKAGE="selenium_ide_pretty_report-${VERSION// }-fx.xpi"

zip -r $PACKAGE * -x LICENSE README.md images/ images/* $0 $PACKAGE
