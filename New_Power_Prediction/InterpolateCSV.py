#!/usr/bin/python3

import sys
import pandas
if len(sys.argv) < 3:
    print("Usage: ./Interpolate.py <input.csv> <output.csv>")
    exit()
loadcsv = pandas.read_csv(sys.argv[1],encoding='iso-8859-1', index_col='Timestamp',parse_dates=['Timestamp'])
loadcsv = loadcsv.interpolate(method='linear',limit_direction='both')
loadcsv.to_csv(sys.argv[2])



