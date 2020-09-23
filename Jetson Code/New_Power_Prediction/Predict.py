#!/usr/bin/python3
# Program to Predict the Weather Conditions -> Power network
# Refer to Train.py for model explanation
from tensorflow.keras.models import Sequential, model_from_json
import numpy as np


# Train Control Variables
# -----------------------
features    = 8 # Input variables in a timestep
num_steps   = 3 # How many timesteps to consider at once
# TODO choose final trained model for this,
# or make that an argument for the webapp to control

# Remember to save favorite model
model_file  = 'models/Power_Pred_model_2020_08_31_10_50.json'
weight_file = 'weights/Power_Pred_weights_2020_08_31_10_50.h5'

# LOAD FROM DISK
json_file = open(model_file, 'r')
loaded_model = json_file.read()
json_file.close()
model = model_from_json(loaded_model)
model.load_weights(weight_file)
print("Loaded model from disk")

# Testing with some data from 2018
# April 11, 15:51-15:53
testinput1 = np.array(
        [[[855.19,48.00,15*.44704,(75.75-32)/1.8,4,11,15,51],
          [852.36,38.33,14*.44704,(75.73-32)/1.8,4,11,15,52],
          [849.53,28.66,13*.44704,(75.71-32)/1.8,4,11,15,53]]])
# April 11, 15:54-15:56
testinput2 = np.array(
        [[[845.66,34.20,13*.44704,(75.63-32)/1.8,4,11,15,54],
          [843.79,39.70,13*.44704,(75.55-32)/1.8,4,11,15,55],
          [838.05,50.81,14*.44704,(75.40-32)/1.8,4,11,15,56]]])

# Use the scalars given from findmaxvalues.py
# NOTE being evaluated, subject to change
def downScale(data):
    # Apply scalars
    output = np.c_[data[0,:,0]/1875.0,# GHI
                   data[0,:,1]/360.0, # WindDir
                   data[0,:,2]/21.0,  # WindSpd
                   data[0,:,3]/58.0,  # AmbTemp
                   data[0,:,4]/12.0,  # Month
                   data[0,:,5]/31.0,  # Day
                   data[0,:,6]/24.0,  # Hour
                   data[0,:,7]/60.0]  # Minute
    output = output.reshape(1,3,8)
    return output
def upScale(data):
    output = np.c_[data[0,:,0]*1875.0,# GHI
                   data[0,:,1]*360.0, # WindDir
                   data[0,:,2]*21.0,  # WindSpd
                   data[0,:,3]*58.0,  # AmbTemp
                   data[0,:,4]*12.0,  # Month
                   data[0,:,5]*31.0,  # Day
                   data[0,:,6]*24.0,  # Hour
                   data[0,:,7]*60.0,  # Minute
                   data[0,:,8]*6470.0]# Power
    output = output.reshape(1,3,9)
    return output

def display(data):
    # Quick and Dirty Display of output
    for x in data:
        for y in x:
            print("Date:    " , int(round(y[4])) , int(round(y[5])) , int(round(y[6])) , int(round(y[7])))
            print("GHI:     " , y[0])
            print("WindDir: " , y[1])
            print("WindSpd: " , y[2])
            print("Temp:    " , y[3])
            if len(y) == 9:
                print("Power:   " , y[8])
            print()
                
 

def makePrediction(data, count, reset=True):
    #NOTE requires time series formatted data in same dimensions
    # as model was trained
    if reset:
        model.reset_states()
    scaled_data = downScale(data)

    for i in range(count):
        print(i) # TODO grab the data and loop it back in
        # rather easy but I was lazy and just making comments to read :^)
    prediction = model.predict(scaled_data)

    output = upScale(prediction)
    return output

# Just experimenting with the functions so far

pred1 = makePrediction(testinput1,1, True)
pred2 = makePrediction(testinput2,1, False)
'''
print(testinput1[0,1,:])
print(pred1[0,0,:])
print(testinput2[0,2,:])
print(pred2[0,1,:])
'''
display(testinput1)
display(pred1)


