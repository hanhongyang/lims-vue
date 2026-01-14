<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="130px">
      <el-form-item label="Dairyland ID" prop="dairylandId">
        <el-input v-model="queryParams.dairylandId" placeholder="请输入Dairyland ID" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="Date Processed" prop="dateProcessed">
        <el-date-picker clearable v-model="queryParams.dateProcessed" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择Date Processed">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Account Number" prop="accountNumber">
        <el-input v-model="queryParams.accountNumber" placeholder="请输入Account Number" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="Sampled For" prop="sampledFor">
        <el-input v-model="queryParams.sampledFor" placeholder="请输入Sampled For" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basicdata:summary:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          >删除</el-button>
      </el-col>
      <!-- 新增导入按钮 -->
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport"
          >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="summaryList" @selection-change="handleSelectionChange" height="70vh">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Dairyland ID" align="center" prop="dairylandId" />
      <el-table-column label="Date Processed" align="center" prop="dateProcessed" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dateProcessed, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Account Number" align="center" prop="accountNumber" />
      <el-table-column label="Sub-Account Number" align="center" prop="subAccountNumber" />
      <el-table-column label="Sampled For" align="center" prop="sampledFor" />
      <el-table-column label="Product Type" align="center" prop="productType" />
      <el-table-column label="Sub Type" align="center" prop="subType" />
      <el-table-column label="ESample No." align="center" prop="eSampleNo" />
      <el-table-column label="Alias" align="center" prop="alias" />
      <el-table-column label="Description 1" align="center" prop="description1" />
      <el-table-column label="Description 2" align="center" prop="description2" />
      <el-table-column label="Description 3" align="center" prop="description3" />
      <el-table-column label="Analysis Package" align="center" prop="analysisPackage" />
      <el-table-column label="Moisture" align="center" prop="moisture" />
      <el-table-column label="Dry Matter" align="center" prop="dryMatter" />
      <el-table-column label="RDM" align="center" prop="rdm" />
      <el-table-column label="pH" align="center" prop="ph" />
      <el-table-column label="CP" align="center" prop="cp" />
      <el-table-column label="AD-ICP" align="center" prop="adIcp" />
      <el-table-column label="ND-ICP" align="center" prop="ndIcp" />
      <el-table-column label="ND-ICPss" align="center" prop="ndIcpss" />
      <el-table-column label="16h RUP %CP" align="center" prop="hRUPPCP16" />
      <el-table-column label="UCP %CP" align="center" prop="ucpCP" />
      <el-table-column label="Soluble Protein" align="center" prop="solubleProtein" />
      <el-table-column label="KOH solubility" align="center" prop="kohSolubility" />
      <el-table-column label="Ammonia" align="center" prop="ammonia" />
      <el-table-column label="Ammonia %CP" align="center" prop="ammoniaCP" />
      <el-table-column label="Ammonia %SP" align="center" prop="ammoniaSP" />
      <el-table-column label="Lysine" align="center" prop="lysine" />
      <el-table-column label="Methionine" align="center" prop="methionine" />
      <el-table-column label="Cysteine" align="center" prop="cysteine" />
      <el-table-column label="Alanine" align="center" prop="alanine" />
      <el-table-column label="Aspartic Acid" align="center" prop="asparticAcid" />
      <el-table-column label="Glutamic Acid" align="center" prop="glutamicAcid" />
      <el-table-column label="Glycine" align="center" prop="glycine" />
      <el-table-column label="Isoleucine" align="center" prop="isoleucine" />
      <el-table-column label="Leucine" align="center" prop="leucine" />
      <el-table-column label="Proline" align="center" prop="proline" />
      <el-table-column label="Threonine" align="center" prop="threonine" />
      <el-table-column label="Valine" align="center" prop="valine" />
      <el-table-column label="Arginine" align="center" prop="arginine" />
      <el-table-column label="Histidine" align="center" prop="histidine" />
      <el-table-column label="Phenylalanine" align="center" prop="phenylalanine" />
      <el-table-column label="Tyrosine" align="center" prop="tyrosine" />
      <el-table-column label="Tryptophan" align="center" prop="tryptophan" />
      <el-table-column label="Serine" align="center" prop="serine" />
      <el-table-column label="Total Amino Acids" align="center" prop="totalAminoAcids" />
      <el-table-column label="ADF" align="center" prop="adf" />
      <el-table-column label="aNDF" align="center" prop="aNdf" />
      <el-table-column label="aNDFom" align="center" prop="aNdfom" />
      <el-table-column label="Lignin" align="center" prop="lignin" />
      <el-table-column label="Crude Fiber" align="center" prop="crudeFiber" />
      <el-table-column label="NDFD12" align="center" prop="ndfd12" />
      <el-table-column label="NDFD24" align="center" prop="ndfd24" />
      <el-table-column label="NDFD30" align="center" prop="ndfd30" />
      <el-table-column label="NDFD48" align="center" prop="ndfd48" />
      <el-table-column label="NDFD72" align="center" prop="ndfd72" />
      <el-table-column label="NDFD120" align="center" prop="ndfd120" />
      <el-table-column label="NDFD240" align="center" prop="ndfd240" />
      <el-table-column label="uNDFom12" align="center" prop="uNdfom12" />
      <el-table-column label="uNDFom24" align="center" prop="uNdfom24" />
      <el-table-column label="uNDFom30" align="center" prop="uNdfom30" />
      <el-table-column label="uNDFom48" align="center" prop="uNdfom48" />
      <el-table-column label="uNDFom72" align="center" prop="uNdfom72" />
      <el-table-column label="uNDFom240" align="center" prop="uNdfom240" />
      <el-table-column label="uNDFom120" align="center" prop="uNdfom120" />
      <el-table-column label="Calibrate NDF" align="center" prop="calibrateNdf" />
      <el-table-column label="FPN" align="center" prop="fpn" />
      <el-table-column label="Starch" align="center" prop="starch" />
      <el-table-column label="Calibrate Starch" align="center" prop="calibrateStarch" />
      <el-table-column label="GPN" align="center" prop="gpn" />
      <el-table-column label="Calibrate Leaf%" align="center" prop="calibrateLeafPercent" />
      <el-table-column label="CSPS" align="center" prop="csps" />
      <el-table-column label="IVSD7" align="center" prop="ivsd7" />
      <el-table-column label="IVSD7-o" align="center" prop="ivsd7o" />
      <el-table-column label="IVSD7-o est" align="center" prop="ivsd7oEst" />
      <el-table-column label="ESC (Sugar)" align="center" prop="escSugar" />
      <el-table-column label="WSC (Sugar)" align="center" prop="wscSugar" />
      <el-table-column label="Sucrose" align="center" prop="sucrose" />
      <el-table-column label="Sucrose %Total sugars" align="center" prop="sucroseTotalSugars" />
      <el-table-column label="Total sugar" align="center" prop="totalSugar" />
      <el-table-column label="Lactose" align="center" prop="lactose" />
      <el-table-column label="EE (Fat)" align="center" prop="eeFat" />
      <el-table-column label="AH Fat" align="center" prop="ahFat" />
      <el-table-column label="TFA" align="center" prop="tfa" />
      <el-table-column label="C120" align="center" prop="c120" />
      <el-table-column label="C140" align="center" prop="c140" />
      <el-table-column label="C141" align="center" prop="c141" />
      <el-table-column label="C160" align="center" prop="c160" />
      <el-table-column label="C161" align="center" prop="c161" />
      <el-table-column label="C170" align="center" prop="c170" />
      <el-table-column label="C180" align="center" prop="c180" />
      <el-table-column label="C181" align="center" prop="c181" />
      <el-table-column label="C182" align="center" prop="c182" />
      <el-table-column label="C183" align="center" prop="c183" />
      <el-table-column label="C190" align="center" prop="c190" />
      <el-table-column label="C200" align="center" prop="c200" />
      <el-table-column label="C201" align="center" prop="c201" />
      <el-table-column label="C202" align="center" prop="c202" />
      <el-table-column label="C203" align="center" prop="c203" />
      <el-table-column label="C204" align="center" prop="c204" />
      <el-table-column label="C205" align="center" prop="c205" />
      <el-table-column label="C220" align="center" prop="c220" />
      <el-table-column label="C221" align="center" prop="c221" />
      <el-table-column label="C226" align="center" prop="c226" />
      <el-table-column label="C240" align="center" prop="c240" />
      <el-table-column label="C241" align="center" prop="c241" />
      <el-table-column label="Other Fatty Acids" align="center" prop="otherFattyAcids" />
      <el-table-column label="C120_TFA" align="center" prop="c120TFA" />
      <el-table-column label="C140_TFA" align="center" prop="c140TFA" />
      <el-table-column label="C141_TFA" align="center" prop="c141TFA" />
      <el-table-column label="C160_TFA" align="center" prop="c160TFA" />
      <el-table-column label="C161_TFA" align="center" prop="c161TFA" />
      <el-table-column label="C170_TFA" align="center" prop="c170TFA" />
      <el-table-column label="C180_TFA" align="center" prop="c180TFA" />
      <el-table-column label="C181_TFA" align="center" prop="c181TFA" />
      <el-table-column label="C182_TFA" align="center" prop="c182TFA" />
      <el-table-column label="C183_TFA" align="center" prop="c183TFA" />
      <el-table-column label="C190_TFA" align="center" prop="c190TFA" />
      <el-table-column label="C200_TFA" align="center" prop="c200TFA" />
      <el-table-column label="C201_TFA" align="center" prop="c201TFA" />
      <el-table-column label="C202_TFA" align="center" prop="c202TFA" />
      <el-table-column label="C203_TFA" align="center" prop="c203TFA" />
      <el-table-column label="C204_TFA" align="center" prop="c204TFA" />
      <el-table-column label="C205_TFA" align="center" prop="c205TFA" />
      <el-table-column label="C220_TFA" align="center" prop="c220TFA" />
      <el-table-column label="C221_TFA" align="center" prop="c221TFA" />
      <el-table-column label="C226_TFA" align="center" prop="c226TFA" />
      <el-table-column label="C240_TFA" align="center" prop="c240TFA" />
      <el-table-column label="C241_TFA" align="center" prop="c241TFA" />
      <el-table-column label="Other Fatty Acids_TFA" align="center" prop="otherFattyAcidsTFA" />
      <el-table-column label="Ash" align="center" prop="ash" />
      <el-table-column label="Ca" align="center" prop="ca" />
      <el-table-column label="P" align="center" prop="p" />
      <el-table-column label="Mg" align="center" prop="mg" />
      <el-table-column label="K" align="center" prop="k" />
      <el-table-column label="S" align="center" prop="s" />
      <el-table-column label="Na" align="center" prop="na" />
      <el-table-column label="Cl" align="center" prop="cl" />
      <el-table-column label="Al" align="center" prop="al" />
      <el-table-column label="B" align="center" prop="b" />
      <el-table-column label="Mn" align="center" prop="mn" />
      <el-table-column label="Zn" align="center" prop="zn" />
      <el-table-column label="Cu" align="center" prop="cu" />
      <el-table-column label="Fe" align="center" prop="fe" />
      <el-table-column label="Lactic Acid" align="center" prop="lacticAcid" />
      <el-table-column label="Acetic Acid" align="center" prop="aceticAcid" />
      <el-table-column label="Propionic Acid" align="center" prop="propionicAcid" />
      <el-table-column label="Butyric Acid" align="center" prop="butyricAcid" />
      <el-table-column label="Iso-Butryic Acid" align="center" prop="isoButryicAcid" />
      <el-table-column label="Ethanol" align="center" prop="ethanol" />
      <el-table-column label="1,2 Propanediol" align="center" prop="Propanediol12" />
      <el-table-column label="Methanol" align="center" prop="methanol" />
      <el-table-column label="Propanol" align="center" prop="propanol" />
      <el-table-column label="Butanol" align="center" prop="butanol" />
      <el-table-column label="Mold Count" align="center" prop="moldCount" />
      <el-table-column label="Yeast Count" align="center" prop="yeastCount" />
      <el-table-column label="Aflatoxin B1" align="center" prop="aflatoxinB1" />
      <el-table-column label="Aflatoxin B2" align="center" prop="aflatoxinB2" />
      <el-table-column label="Aflatoxin G1" align="center" prop="aflatoxinG1" />
      <el-table-column label="Aflatoxin G2" align="center" prop="aflatoxinG2" />
      <el-table-column label="Zearalenone" align="center" prop="zearalenone" />
      <el-table-column label="T2" align="center" prop="t2" />
      <el-table-column label="HT2" align="center" prop="ht2" />
      <el-table-column label="Neosolaniol" align="center" prop="neosolaniol" />
      <el-table-column label="DAS" align="center" prop="das" />
      <el-table-column label="Ochratoxin A" align="center" prop="ochratoxinA" />
      <el-table-column label="Citrinin" align="center" prop="citrinin" />
      <el-table-column label="Patulin" align="center" prop="patulin" />
      <el-table-column label="Fumonisin B1" align="center" prop="fumonisinB1" />
      <el-table-column label="Fumonisin B2" align="center" prop="fumonisinB2" />
      <el-table-column label="Fumonisin B3" align="center" prop="fumonisinB3" />
      <el-table-column label="Vomitoxin (DON)" align="center" prop="vomitoxinDON" />
      <el-table-column label="3 Acetyl DON" align="center" prop="AcetylDON3" />
      <el-table-column label="15 Acetyl DON" align="center" prop="AcetylDON15" />
      <el-table-column label="Fusarenon X" align="center" prop="fusarenonX" />
      <el-table-column label="Nivalenol" align="center" prop="nivalenol" />
      <el-table-column label="Fusaric Acid" align="center" prop="fusaricAcid" />
      <el-table-column label="Total Aflatoxins" align="center" prop="totalAflatoxins" />
      <el-table-column label="Roquefortine C" align="center" prop="roquefortineC" />
      <el-table-column label="Total Fumonisins" align="center" prop="totalFumonisins" />
      <el-table-column label="Total DONs" align="center" prop="totalDONs" />
      <el-table-column label="Total T2/HT2" align="center" prop="totalT2HT2" />
      <el-table-column label="DON (Vomitoxin) threshold 2 ppm" align="center" prop="donVomitoxinThreshold2Ppm" />
      <el-table-column label="Zearalenone threshold 100 ppb" align="center" prop="zearalenoneThreshold100Ppb" />
      <el-table-column label="T2/HT2 threshold 10 ppb" align="center" prop="t2HT2Threshold10Ppb" />
      <el-table-column label="Fumonisin threshold 0.5 ppm" align="center" prop="fumonisinThreshold05Ppm" />
      <el-table-column label="Mucor" align="center" prop="mucor" />
      <el-table-column label="Rhizopus" align="center" prop="rhizopus" />
      <el-table-column label="Cladosporium" align="center" prop="cladosporium" />
      <el-table-column label="Penicillium" align="center" prop="penicillium" />
      <el-table-column label="Aspergillius" align="center" prop="aspergillius" />
      <el-table-column label="Fusarium" align="center" prop="fusarium" />
      <el-table-column label="Other Mold" align="center" prop="otherMold" />
      <el-table-column label="Coliform" align="center" prop="coliform" />
      <el-table-column label="Clostridia perfringens" align="center" prop="clostridiaPerfringens" />
      <el-table-column label="E.coli" align="center" prop="eColi" />
      <el-table-column label="Enterobacteriaceae" align="center" prop="enterobacteriaceae" />
      <el-table-column label="Nitrate Nitrogen" align="center" prop="nitrateNitrogen" />
      <el-table-column label="Adjusted CP" align="center" prop="adjustedCP" />
      <el-table-column label="RDP-NRC01 %CP" align="center" prop="rdpNrc01CP" />
      <el-table-column label="RDP-NRC01 %DM" align="center" prop="rdpNrc01DM" />
      <el-table-column label="RUP-NRC01 %CP" align="center" prop="rupNrc01CP" />
      <el-table-column label="RUP-NRC01 %DM" align="center" prop="rupNrc01DM" />
      <el-table-column label="NFC" align="center" prop="nfc" />
      <el-table-column label="Lactic:Acetic Ratio" align="center" prop="lacticAceticRatio" />
      <el-table-column label="RFV" align="center" prop="rfv" />
      <el-table-column label="RFQ" align="center" prop="rfq" />
      <el-table-column label="DOMI-90% dry" align="center" prop="domi90PercentDry" />
      <el-table-column label="California TDN-90% dry" align="center" prop="californiaTDN90PercentDry" />
      <el-table-column label="DCAD" align="center" prop="dcad" />
      <el-table-column label="NDF kd rate Van Amburgh" align="center" prop="ndfKdRateVanAmburgh" />
      <el-table-column label="NDF kd rate MIR" align="center" prop="ndfKdRateMIR" />
      <el-table-column label="TTNDFD" align="center" prop="ttnDfd" />
      <el-table-column label="Starch kd rate MIR_P1T1" align="center" prop="starchkdratemirP1t1" />
      <el-table-column label="TDN - ADF" align="center" prop="tdnADF" />
      <el-table-column label="NEG - ADF" align="center" prop="negADF" />
      <el-table-column label="NEM - ADF" align="center" prop="nemADF" />
      <el-table-column label="NEL - ADF" align="center" prop="nelADF" />
      <el-table-column label="TDN OARDC" align="center" prop="tdnOARDC" />
      <el-table-column label="NEG OARDC" align="center" prop="negOARDC" />
      <el-table-column label="NEM OARDC" align="center" prop="nemOARDC" />
      <el-table-column label="NEL OARDC" align="center" prop="nelOARDC" />
      <el-table-column label="ME OARDC" align="center" prop="meOARDC" />
      <el-table-column label="TDN Milk 2006" align="center" prop="tdnMilk2006" />
      <el-table-column label="NEG Milk 2006" align="center" prop="negMilk2006" />
      <el-table-column label="NEM Milk 2006" align="center" prop="nemMilk2006" />
      <el-table-column label="NEL Milk 2006 Processed" align="center" prop="nelMilk2006Processed" />
      <el-table-column label="NEL Milk 2006 Non-Processed" align="center" prop="nelMilk2006NonProcessed" />
      <el-table-column label="Milk/ton Corn Silage Milk 2006" align="center" prop="milkTonCornSilageMilk2006" />
      <el-table-column label="Milk/acre - MLK06 Proc" align="center" prop="milkAcreMLK06Proc" />
      <el-table-column label="Milk/acre - MLK06 NonProc" align="center" prop="milkAcreMLK06NonProc" />
      <el-table-column label="TDN - Milk 13" align="center" prop="tdnMilk13" />
      <el-table-column label="NEL - Milk 13" align="center" prop="nelMilk13" />
      <el-table-column label="NEG - Milk 13" align="center" prop="negMilk13" />
      <el-table-column label="NEM - Milk 13" align="center" prop="nemMilk13" />
      <el-table-column label="Milk Per Ton - Milk 13" align="center" prop="milkPerTonMilk13" />
      <el-table-column label="Beef per Ton" align="center" prop="beefPerTon" />
      <el-table-column label="Neg - ISU Beef Mcal/cwt" align="center" prop="negISUBeefMcalCwt" />
      <el-table-column label="Nem - ISU Beef Mcal/cwt" align="center" prop="nemISUBeefMcalCwt" />
      <el-table-column label="Neg - ISU Beef Mcal/lb" align="center" prop="negISUBeefMcalLb" />
      <el-table-column label="Nem - ISU Beef Mcal/lb" align="center" prop="nemISUBeefMcalLb" />
      <el-table-column label="Neg - ISU Beef Mcal/kg" align="center" prop="negISUBeefMcalKg" />
      <el-table-column label="Nem - ISU Beef Mcal/kg" align="center" prop="nemISUBeefMcalKg" />
      <el-table-column label="Neg - ISU Beef MJ/kg" align="center" prop="negISUBeefMJKg" />
      <el-table-column label="Nem - ISU Beef MJ/kg" align="center" prop="nemISUBeefMJKg" />
      <el-table-column label="TDN 1x - ISU Beef" align="center" prop="tdn1xISUBeef" />
      <el-table-column label="Swine DE" align="center" prop="swineDE" />
      <el-table-column label="Swine ME" align="center" prop="swineME" />
      <el-table-column label="Swine NE" align="center" prop="swineNE" />
      <el-table-column label="Equine DE" align="center" prop="equineDE" />
      <el-table-column label="Equine TDN" align="center" prop="equineTDN" />
      <el-table-column label="DM Yield" align="center" prop="dmYield" />
      <el-table-column label="ME - GfE 2001" align="center" prop="meGfE2001" />
      <el-table-column label="Rohfaser - GfE 2001" align="center" prop="rohfaserGfE2001" />
      <el-table-column label="nXP - GfE 2001" align="center" prop="nXPGfE2001" />
      <el-table-column label="RNB - GfE 2001" align="center" prop="rnbGfE2001" />
      <el-table-column label="NEL - Milk24 Mcal/cwt" align="center" prop="nelMilk24McalCwt" />
      <el-table-column label="Milk Per Ton - Milk24 lbs/ton" align="center" prop="milkPerTonMilk24LbsTon" />
      <el-table-column label="导入时间" align="center" prop="importTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.importTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入人" align="center" prop="importBy" />
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basicdata:summary:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basicdata:summary:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 新增导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls, .csv" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据 -->
          <!-- <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link> -->
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入xlsx、xls、csv格式文件！导入时间可能较长请您耐心等待，弹出完成提示框既导入完成。
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改近红外汇总对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- 这里只展示部分表单字段作为示例，实际使用时需要根据需求添加 -->
        <el-form-item label="Dairyland ID" prop="dairylandId">
          <el-input v-model="form.dairylandId" placeholder="请输入Dairyland ID" />
        </el-form-item>
        <el-form-item label="Date Processed" prop="dateProcessed">
          <el-date-picker clearable v-model="form.dateProcessed" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择Date Processed">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Account Number" prop="accountNumber">
          <el-input v-model="form.accountNumber" placeholder="请输入Account Number" />
        </el-form-item>
        <el-form-item label="Sub-Account Number" prop="subAccountNumber">
          <el-input v-model="form.subAccountNumber" placeholder="请输入Sub-Account Number" />
        </el-form-item>
        <el-form-item label="Sampled For" prop="sampledFor">
          <el-input v-model="form.sampledFor" placeholder="请输入Sampled For" />
        </el-form-item>
        <el-form-item label="Product Type" prop="productType">
          <el-input v-model="form.productType" placeholder="请输入Product Type" />
        </el-form-item>
        <el-form-item label="Sub Type" prop="subType">
          <el-input v-model="form.subType" placeholder="请输入Sub Type" />
        </el-form-item>
        <!-- 其他表单字段按照相同方式添加 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSummary, getSummary, delSummary, addSummary, updateSummary } from "@/api/CentralLaboratory/summary";
import { getToken } from "@/utils/auth";

export default {
  name: "Summary",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 近红外汇总表格数据
      summaryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dairylandId: null,
        dateProcessed: null,
        accountNumber: null,
        subAccountNumber: null,
        sampledFor: null,
        productType: null,
        subType: null,
        eSampleNo: null,
        alias: null,
        description1: null,
        description2: null,
        description3: null,
        analysisPackage: null,
        moisture: null,
        dryMatter: null,
        rdm: null,
        ph: null,
        cp: null,
        adIcp: null,
        ndIcp: null,
        ndIcpss: null,
        hRUPPCP16: null,
        ucpCP: null,
        solubleProtein: null,
        kohSolubility: null,
        ammonia: null,
        ammoniaCP: null,
        ammoniaSP: null,
        lysine: null,
        methionine: null,
        cysteine: null,
        alanine: null,
        asparticAcid: null,
        glutamicAcid: null,
        glycine: null,
        isoleucine: null,
        leucine: null,
        proline: null,
        threonine: null,
        valine: null,
        arginine: null,
        histidine: null,
        phenylalanine: null,
        tyrosine: null,
        tryptophan: null,
        serine: null,
        totalAminoAcids: null,
        adf: null,
        aNdf: null,
        aNdfom: null,
        lignin: null,
        crudeFiber: null,
        ndfd12: null,
        ndfd24: null,
        ndfd30: null,
        ndfd48: null,
        ndfd72: null,
        ndfd120: null,
        ndfd240: null,
        uNdfom12: null,
        uNdfom24: null,
        uNdfom30: null,
        uNdfom48: null,
        uNdfom72: null,
        uNdfom240: null,
        uNdfom120: null,
        calibrateNdf: null,
        fpn: null,
        starch: null,
        calibrateStarch: null,
        gpn: null,
        calibrateLeafPercent: null,
        csps: null,
        ivsd7: null,
        ivsd7o: null,
        ivsd7oEst: null,
        escSugar: null,
        wscSugar: null,
        sucrose: null,
        sucroseTotalSugars: null,
        totalSugar: null,
        lactose: null,
        eeFat: null,
        ahFat: null,
        tfa: null,
        c120: null,
        c140: null,
        c141: null,
        c160: null,
        c161: null,
        c170: null,
        c180: null,
        c181: null,
        c182: null,
        c183: null,
        c190: null,
        c200: null,
        c201: null,
        c202: null,
        c203: null,
        c204: null,
        c205: null,
        c220: null,
        c221: null,
        c226: null,
        c240: null,
        c241: null,
        otherFattyAcids: null,
        c120TFA: null,
        c140TFA: null,
        c141TFA: null,
        c160TFA: null,
        c161TFA: null,
        c170TFA: null,
        c180TFA: null,
        c181TFA: null,
        c182TFA: null,
        c183TFA: null,
        c190TFA: null,
        c200TFA: null,
        c201TFA: null,
        c202TFA: null,
        c203TFA: null,
        c204TFA: null,
        c205TFA: null,
        c220TFA: null,
        c221TFA: null,
        c226TFA: null,
        c240TFA: null,
        c241TFA: null,
        otherFattyAcidsTFA: null,
        ash: null,
        ca: null,
        p: null,
        mg: null,
        k: null,
        s: null,
        na: null,
        cl: null,
        al: null,
        b: null,
        mn: null,
        zn: null,
        cu: null,
        fe: null,
        lacticAcid: null,
        aceticAcid: null,
        propionicAcid: null,
        butyricAcid: null,
        isoButryicAcid: null,
        ethanol: null,
        Propanediol12: null,
        methanol: null,
        propanol: null,
        butanol: null,
        moldCount: null,
        yeastCount: null,
        aflatoxinB1: null,
        aflatoxinB2: null,
        aflatoxinG1: null,
        aflatoxinG2: null,
        zearalenone: null,
        t2: null,
        ht2: null,
        neosolaniol: null,
        das: null,
        ochratoxinA: null,
        citrinin: null,
        patulin: null,
        fumonisinB1: null,
        fumonisinB2: null,
        fumonisinB3: null,
        vomitoxinDON: null,
        AcetylDON3: null,
        AcetylDON15: null,
        fusarenonX: null,
        nivalenol: null,
        fusaricAcid: null,
        totalAflatoxins: null,
        roquefortineC: null,
        totalFumonisins: null,
        totalDONs: null,
        totalT2HT2: null,
        donVomitoxinThreshold2Ppm: null,
        zearalenoneThreshold100Ppb: null,
        t2HT2Threshold10Ppb: null,
        fumonisinThreshold05Ppm: null,
        mucor: null,
        rhizopus: null,
        cladosporium: null,
        penicillium: null,
        aspergillius: null,
        fusarium: null,
        otherMold: null,
        coliform: null,
        clostridiaPerfringens: null,
        eColi: null,
        enterobacteriaceae: null,
        nitrateNitrogen: null,
        adjustedCP: null,
        rdpNrc01CP: null,
        rdpNrc01DM: null,
        rupNrc01CP: null,
        rupNrc01DM: null,
        nfc: null,
        lacticAceticRatio: null,
        rfv: null,
        rfq: null,
        domi90PercentDry: null,
        californiaTDN90PercentDry: null,
        dcad: null,
        ndfKdRateVanAmburgh: null,
        ndfKdRateMIR: null,
        ttnDfd: null,
        starchkdratemirP1t1: null,
        tdnADF: null,
        negADF: null,
        nemADF: null,
        nelADF: null,
        tdnOARDC: null,
        negOARDC: null,
        nemOARDC: null,
        nelOARDC: null,
        meOARDC: null,
        tdnMilk2006: null,
        negMilk2006: null,
        nemMilk2006: null,
        nelMilk2006Processed: null,
        nelMilk2006NonProcessed: null,
        milkTonCornSilageMilk2006: null,
        milkAcreMLK06Proc: null,
        milkAcreMLK06NonProc: null,
        tdnMilk13: null,
        nelMilk13: null,
        negMilk13: null,
        nemMilk13: null,
        milkPerTonMilk13: null,
        beefPerTon: null,
        negISUBeefMcalCwt: null,
        nemISUBeefMcalCwt: null,
        negISUBeefMcalLb: null,
        nemISUBeefMcalLb: null,
        negISUBeefMcalKg: null,
        nemISUBeefMcalKg: null,
        negISUBeefMJKg: null,
        nemISUBeefMJKg: null,
        tdn1xISUBeef: null,
        swineDE: null,
        swineME: null,
        swineNE: null,
        equineDE: null,
        equineTDN: null,
        dmYield: null,
        meGfE2001: null,
        rohfaserGfE2001: null,
        nXPGfE2001: null,
        rnbGfE2001: null,
        nelMilk24McalCwt: null,
        milkPerTonMilk24LbsTon: null,
        importTime: null,
        importBy: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 导入参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/basicdata/summary/import"
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询近红外汇总列表 */
    getList() {
      this.loading = true;
      listSummary(this.queryParams).then(response => {
        this.summaryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dairylandId: null,
        dateProcessed: null,
        accountNumber: null,
        subAccountNumber: null,
        sampledFor: null,
        productType: null,
        subType: null,
        eSampleNo: null,
        alias: null,
        description1: null,
        description2: null,
        description3: null,
        analysisPackage: null,
        moisture: null,
        dryMatter: null,
        rdm: null,
        ph: null,
        cp: null,
        adIcp: null,
        ndIcp: null,
        ndIcpss: null,
        hRUPPCP16: null,
        ucpCP: null,
        solubleProtein: null,
        kohSolubility: null,
        ammonia: null,
        ammoniaCP: null,
        ammoniaSP: null,
        lysine: null,
        methionine: null,
        cysteine: null,
        alanine: null,
        asparticAcid: null,
        glutamicAcid: null,
        glycine: null,
        isoleucine: null,
        leucine: null,
        proline: null,
        threonine: null,
        valine: null,
        arginine: null,
        histidine: null,
        phenylalanine: null,
        tyrosine: null,
        tryptophan: null,
        serine: null,
        totalAminoAcids: null,
        adf: null,
        aNdf: null,
        aNdfom: null,
        lignin: null,
        crudeFiber: null,
        ndfd12: null,
        ndfd24: null,
        ndfd30: null,
        ndfd48: null,
        ndfd72: null,
        ndfd120: null,
        ndfd240: null,
        uNdfom12: null,
        uNdfom24: null,
        uNdfom30: null,
        uNdfom48: null,
        uNdfom72: null,
        uNdfom240: null,
        uNdfom120: null,
        calibrateNdf: null,
        fpn: null,
        starch: null,
        calibrateStarch: null,
        gpn: null,
        calibrateLeafPercent: null,
        csps: null,
        ivsd7: null,
        ivsd7o: null,
        ivsd7oEst: null,
        escSugar: null,
        wscSugar: null,
        sucrose: null,
        sucroseTotalSugars: null,
        totalSugar: null,
        lactose: null,
        eeFat: null,
        ahFat: null,
        tfa: null,
        c120: null,
        c140: null,
        c141: null,
        c160: null,
        c161: null,
        c170: null,
        c180: null,
        c181: null,
        c182: null,
        c183: null,
        c190: null,
        c200: null,
        c201: null,
        c202: null,
        c203: null,
        c204: null,
        c205: null,
        c220: null,
        c221: null,
        c226: null,
        c240: null,
        c241: null,
        otherFattyAcids: null,
        c120TFA: null,
        c140TFA: null,
        c141TFA: null,
        c160TFA: null,
        c161TFA: null,
        c170TFA: null,
        c180TFA: null,
        c181TFA: null,
        c182TFA: null,
        c183TFA: null,
        c190TFA: null,
        c200TFA: null,
        c201TFA: null,
        c202TFA: null,
        c203TFA: null,
        c204TFA: null,
        c205TFA: null,
        c220TFA: null,
        c221TFA: null,
        c226TFA: null,
        c240TFA: null,
        c241TFA: null,
        otherFattyAcidsTFA: null,
        ash: null,
        ca: null,
        p: null,
        mg: null,
        k: null,
        s: null,
        na: null,
        cl: null,
        al: null,
        b: null,
        mn: null,
        zn: null,
        cu: null,
        fe: null,
        lacticAcid: null,
        aceticAcid: null,
        propionicAcid: null,
        butyricAcid: null,
        isoButryicAcid: null,
        ethanol: null,
        Propanediol12: null,
        methanol: null,
        propanol: null,
        butanol: null,
        moldCount: null,
        yeastCount: null,
        aflatoxinB1: null,
        aflatoxinB2: null,
        aflatoxinG1: null,
        aflatoxinG2: null,
        zearalenone: null,
        t2: null,
        ht2: null,
        neosolaniol: null,
        das: null,
        ochratoxinA: null,
        citrinin: null,
        patulin: null,
        fumonisinB1: null,
        fumonisinB2: null,
        fumonisinB3: null,
        vomitoxinDON: null,
        AcetylDON3: null,
        AcetylDON15: null,
        fusarenonX: null,
        nivalenol: null,
        fusaricAcid: null,
        totalAflatoxins: null,
        roquefortineC: null,
        totalFumonisins: null,
        totalDONs: null,
        totalT2HT2: null,
        donVomitoxinThreshold2Ppm: null,
        zearalenoneThreshold100Ppb: null,
        t2HT2Threshold10Ppb: null,
        fumonisinThreshold05Ppm: null,
        mucor: null,
        rhizopus: null,
        cladosporium: null,
        penicillium: null,
        aspergillius: null,
        fusarium: null,
        otherMold: null,
        coliform: null,
        clostridiaPerfringens: null,
        eColi: null,
        enterobacteriaceae: null,
        nitrateNitrogen: null,
        adjustedCP: null,
        rdpNrc01CP: null,
        rdpNrc01DM: null,
        rupNrc01CP: null,
        rupNrc01DM: null,
        nfc: null,
        lacticAceticRatio: null,
        rfv: null,
        rfq: null,
        domi90PercentDry: null,
        californiaTDN90PercentDry: null,
        dcad: null,
        ndfKdRateVanAmburgh: null,
        ndfKdRateMIR: null,
        ttnDfd: null,
        starchkdratemirP1t1: null,
        tdnADF: null,
        negADF: null,
        nemADF: null,
        nelADF: null,
        tdnOARDC: null,
        negOARDC: null,
        nemOARDC: null,
        nelOARDC: null,
        meOARDC: null,
        tdnMilk2006: null,
        negMilk2006: null,
        nemMilk2006: null,
        nelMilk2006Processed: null,
        nelMilk2006NonProcessed: null,
        milkTonCornSilageMilk2006: null,
        milkAcreMLK06Proc: null,
        milkAcreMLK06NonProc: null,
        tdnMilk13: null,
        nelMilk13: null,
        negMilk13: null,
        nemMilk13: null,
        milkPerTonMilk13: null,
        beefPerTon: null,
        negISUBeefMcalCwt: null,
        nemISUBeefMcalCwt: null,
        negISUBeefMcalLb: null,
        nemISUBeefMcalLb: null,
        negISUBeefMcalKg: null,
        nemISUBeefMcalKg: null,
        negISUBeefMJKg: null,
        nemISUBeefMJKg: null,
        tdn1xISUBeef: null,
        swineDE: null,
        swineME: null,
        swineNE: null,
        equineDE: null,
        equineTDN: null,
        dmYield: null,
        meGfE2001: null,
        rohfaserGfE2001: null,
        nXPGfE2001: null,
        rnbGfE2001: null,
        nelMilk24McalCwt: null,
        milkPerTonMilk24LbsTon: null,
        importTime: null,
        importBy: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dairylandId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加近红外汇总";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dairylandId = row.dairylandId || this.ids
      getSummary(dairylandId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改近红外汇总";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dairylandId != null) {
            updateSummary(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSummary(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dairylandIds = row.dairylandId || this.ids;
      this.$modal.confirm('是否确认删除近红外汇总编号为"' + dairylandIds + '"的数据项？').then(function () {
        return delSummary(dairylandIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basicdata/summary/export', {
        ...this.queryParams
      }, `summary_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "近红外汇总导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('basicdata/summary/importTemplate', {}, `近红外汇总导入模板_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
