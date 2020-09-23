#!/usr/bin/python3
# Script scans csv files for the largest values for each data point
# Returns both them as well as the maximums *1.3 for safety range

import sys
import pandas
if len(sys.argv) < 2:
    print("Usage: ./Interpolate.py <input.csv>")
    exit()
loadcsv = pandas.read_csv(sys.argv[1],encoding='iso-8859-1', index_col='Timestamp',parse_dates=['Timestamp'])

# Find max power
power_output = loadcsv['LF_Prod1_kWac'].add(loadcsv['LF_Prod2_kWac'])
power_output = power_output.add(loadcsv['LF_Prod3_kWac'])
power_output = power_output.add(loadcsv['LF_Prod4_kWac'])

# Find max GHI
GHI_data = loadcsv['LF_WS2_GHI W/m']

# Find max Wind Spd
def MPHtoMPS(mph):
    return mph * 0.44704
windSpd_data = loadcsv['LF_WS1_WindSpd mph'].apply(MPHtoMPS)

# Find max Temperature
def toCelsius(Fahrenheit):
    return (Fahrenheit - 32) / 1.8
ambTemp_data = loadcsv['LF_WS1_TempAmb F'].apply(toCelsius)
print("Max power recorded:", max(power_output), "kW ac")
print("Max GHI recorded:", max(GHI_data), " W/m")
print("Max wind speed recorded:", max(windSpd_data), " mph")
print("Max ambient temperature recorded: ",  max(ambTemp_data), " C")

print("\n")
 
print("Max power expected (130%):", 1.3*max(power_output), " kW ac")
print("Max GHI expected (130%):", 1.3*max(GHI_data), " W/m")
print("Max wind speed expected (130%):", 1.3*max(windSpd_data), " mph")
print("Max ambient temperature expected (130%): ",  1.3*max(ambTemp_data), " C")
 
print("\n")

