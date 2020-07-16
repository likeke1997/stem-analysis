# -*- coding: utf-8 -*-
import sys
import numpy as np
from scipy.optimize import curve_fit

# 逻辑斯蒂模型
def modelLogistic(x, a, b, k):
    return k / (1 + np.exp(-a*x+b))

# 理查德模型
def modelRichards(x, a, b, m):
    return m * (1 - np.exp(-a*x)) ** b

# 拟合模型
def fitCurve(model, ages, volumes):
    # 获取参数
    popt, pcov = curve_fit(model, ages, volumes, bounds=[-10,10])
    a, b, c = popt
    # 计算估计量
    # 0.volumeCount
    volumeCount = len(volumes)
    # 0.volumeMean
    volumeMean = 0
    for volume in volumes:
        volumeMean += volume
    volumeMean /= volumeCount
    # 1.预测volumes
    predicts = []
    for age in ages:
        predicts.append(model(age, a, b, c))
    # 2.SSE
    SSE = 0
    for i in range(volumeCount):
        SSE += (volumes[i] - predicts[i]) ** 2
    # 3.SST
    SST = 0
    for i in range(volumeCount):
        SST += (volumes[i] - volumeMean) ** 2
    # 4.SSR
    SSR = SST - SSE
    # 5.R2
    R2 = SSR / SST
    # 6.MSE
    MSE = SSE / volumeCount
    # 7.RMSE
    RMSE = np.sqrt(MSE)
    # 返回
    return a, b, c, predicts, SSE, R2, RMSE
    

# 获取数据
def getDatas():
    flag = ""
    ages = []
    volumes = []
    for argv in sys.argv:
        # 获取flag
        if argv=="-ages":
            flag = "ages"
            continue
        if argv=="-volumes":
            flag = "volumes"
            continue
        # 设置参数
        if flag=="ages":
            ages.append(float(argv))
        if flag=="volumes":
            volumes.append(float(argv))
    return ages, volumes


ages, volumes = getDatas()

a_L, b_L, c_L, predicts_L, SSE_L, R2_L, RMSE_L = fitCurve(modelLogistic, ages, volumes)
#a_R, b_R, c_R, predicts_R, SSE_R, R2_R, RMSE_R = fitCurve(modelRichards, ages, volumes)

result = {
    "params": [a_L, b_L, c_L],
    "predicts": predicts_L,
    "SSE": SSE_L,
    "R2": R2_L,
    "RMSE": RMSE_L
}

print(result)