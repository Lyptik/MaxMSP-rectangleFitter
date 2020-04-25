
/*
	Fits a node inside a panel whatever its ratio
	input : slotID + osc stream of objects / output : corresponding pid or oid
	
	Disclaimer : You need to set the scripting name "node" to your node 
	and "panel" to your panel in the inspector
*/

inlets = 1;
setinletassist(0,"scene");

// global vars
g = new Global("slotManagerGlobal");
g.protocolVersion = 2; // default to protocol V2

// script vars
var sceneWidthID;
var sceneHeightID;
var sceneRatio;
var node;
var panel;

init();

// --------------- Public "triggerable" functions ---------
function anything() {
	
	var argArray = arrayfromargs(messagename,arguments);

	if(inlet==0)
	{
		//post("sceneRatio : " + sceneRatio + "\n");
		//post("argArray[sceneHeightID] : " + argArray[sceneHeightID] + "\n");
		//post("argArray[sceneWidthID]/argArray[sceneHeightID] : " + argArray[sceneWidthID]/argArray[sceneHeightID] + "\n");
		//post("argArray[sceneHeightID] : " + sceneWidthID + "\n");

		if(argArray[sceneHeightID] != 0) // avoid divide by 0
		{

			if(sceneRatio != argArray[sceneWidthID]/argArray[sceneHeightID])
			{
				//post("Scene did change size ! resizing...\n");
				sceneRatio = argArray[sceneWidthID]/argArray[sceneHeightID];

				resize(sceneRatio, "patching_rect");
				resize(sceneRatio, "presentation_rect");
			}
		} else {

			error("Scene height = 0 ! skipping...\n");
		}
	}
}

function setProtocolVersion(_version)
{
	if(_version == 1)
	{
		g.protocolVersion = 1;
		init();
	} else if (_version == 2)
	{
		g.protocolVersion = 2;
		init();
	} else {
		error("Did not understand protocol version correctly\n");
	}
}

// --------------  Internal functions ---------------------

init.local = 1;
function init()
{
	post("Init...\n");
	sceneRatio = -1;

	node = this.patcher.getnamed("node");
	panel = this.patcher.getnamed("panel");

	if(g.protocolVersion == 1)
	{
		sceneWidthID = 5;
		sceneHeightID = 6;
	} else if(g.protocolVersion == 2)
	{
		sceneWidthID = 2;
		sceneHeightID = 3;
	} else {
		error("protocolVersion needs to be set !\n");
	}	
}

resize.local=1
function resize(_nodeRatio, _attr)
{
	var panelCoord = panel.getattr(_attr);
	var nodeCoord = node.getattr(_attr);		

	//post("panelCoord : " + nodeCoord[0]);	
	
	var panelCoordX = panelCoord[0];
	var panelCoordY = panelCoord[1];
	var panelWidth = panelCoord[2];
	var panelHeight = panelCoord[3];

	var nodeCoordX;
	var nodeCoordY;

	//post("_nodeRatio : " +  _nodeRatio + "\n");

	// Computing node coordinates
	if(_nodeRatio >= 1)
	{
		//post("width >= height\n");
		//post("panelCoordX : " + panelCoordX + "\n");
		nodeCoordX = panelCoordX;
		nodeWidth = panelWidth;
		nodeHeight = nodeWidth/_nodeRatio;
		nodeCoordY = panelCoordY + (panelHeight - nodeHeight)/2;
	
	} else {

		nodeCoordY = panelCoordY;
		nodeHeight = panelHeight;
		nodeWidth = nodeHeight*_nodeRatio;
		nodeCoordX = panelCoordX + (panelWidth - nodeWidth)/2;		
	}

	// Setting coord to node object
	node.message(_attr,nodeCoordX, nodeCoordY, nodeWidth, nodeHeight);
}
