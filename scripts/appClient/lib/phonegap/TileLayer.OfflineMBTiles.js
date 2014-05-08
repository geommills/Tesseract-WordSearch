L.TileLayer.OfflineMBTiles = L.TileLayer.extend({
	getTileUrl: function (tilePoint) {
		var z = this._getZoomForUrl();
		//monitor this, positioning could be janky
		//var y = (1 << z) - 1 - tilePoint.y;
		var y = tilePoint.y;
		var x = tilePoint.x;
		var base64Prefix = "data:image/png;base64,";
		//don't process y?
		//console.log(z + "|" + x + "|" + y);
		
		var rtn = "";
		if (window.PhonegapCustom !== undefined){
			var tiledata = PhonegapCustom.getTileUrl(z,x,y);
			if (tiledata){
				rtn = base64Prefix + tiledata;
			}
			//console.log(rtn);
		}else{
			var rtn = 'data:image/png;base64,'+
				'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI'+
				'WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gEOFSgFDoWywgAAAB1pVFh0Q29tbWVudAAAAAAAQ3Jl'+
				'YXRlZCB3aXRoIEdJTVBkLmUHAAAGKklEQVR42u3ZT0hUaxjA4Ve90BRWY6hEErhq5dKgQLE2WSkj'+
				'RVAZRElBm8plrooJ+gfhIjChoqKiFpUOYYuSEHI5m0JqFxSBJZMRY4uS8q6KRNOx7r3Q9XlAZM53'+
				'zvedc4TfmRmLstnsRADzUrFbAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIA'+
				'CAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAAAIACAAgAIAAgAAAAgAIACAAgAAAAgAI'+
				'ACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAAgAAAAgAIACAA'+
				'gAAAAgAIACAAgACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACA'+
				'AAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAAACAAgAIACAAIAAAAIACAAgAIAAAAIACAAgAIAA'+
				'AAIACAAgAIAAAAIACAAgAIAA/K/V1tbGiRMnpt3+O3O2tbVN2d7e3v5b8xaybm1tbaxZsyY2bdoU'+
				'J0+ejLdv3855DgRgXhkdHY3nz5//43MODQ19f/3q1at4+fLlv34t2Ww2BgYG4vz581FVVRX79++P'+
				'XC7njywA/Mzhw4fj7NmzMTExMe34+Ph4dHZ2RmNjYzQ2NkZnZ2eMj4/POOfOnTvj+vXr31/funUr'+
				'du3aNWW/lpaWqKuri7q6utizZ088e/Zs0tP49u3bkUqloqGhITo6OmJsbGzW60kkElFdXR27d++O'+
				'VCoVFy5cKGjNb0//b+8kfnw3MNN5IgB/tJUrV0ZNTU1kMplpxy9fvhzLli2LTCYTmUwmli5dGleu'+
				'XJlxzlQqFdlsNoaHh2NsbCwGBwejubl5yn6ZTCYGBwejv78/6uvrI51OTxrP5XLR3d0dfX19UVZW'+
				'Ft3d3XO6tqampnj8+HFBa2az2e+/v/0Uep4IwB9t3759cePGjfjw4cOUsfv370dLS0skEolIJBKx'+
				'devW6Ovrm3G+hQsXxpYtW+LmzZvR29sbzc3NkUgkZnxqt7a2xosXLyZtP3DgQKxYsSJKS0ujra0t'+
				'BgYG5nRd5eXlMTo6Oqc1Z3t3Mddj+Of85Rb8O0pLS6O1tTW6urqio6Nj0tjIyEgsXrx40r4jIyOz'+
				'zrl9+/bYsWNHJJPJuHjx4pTxN2/exNWrV+PJkyeRy+Uin8/H169ffzpfMpmc8+f5d+/eRXl5+S+v'+
				'+avHIAB/nJaWlrhz586ULwQrKysjn89HMpmMiIh8Ph+VlZUFPX3r6+tjwYIF34/90aFDh2L9+vWR'+
				'TqejoqIiFi1aFGvXrv3pfB8/fpx2npncu3cvGhoaCl6zqKgovnz5EiUlJb98ngjAn/n5qrg42tvb'+
				'4/Tp05O2b968Oe7evRutra0REdHT0xNNTU0FzXn06NGfjr1//z5Wr14d1dXVkcvl4tGjR1P2GRoa'+
				'ilWrVsXnz5+jp6cnampqZl3z06dPMTw8HL29vdHf3x/Xrl0reM2qqqp4+PBhbNiwIYqLiws+TwTg'+
				'f6G2tjYqKiombdu7d2+cO3cuUqlURERs3LgxDh48+NtrpdPpOHXqVLx+/TqWL18+7ZeEXV1d8fTp'+
				'00gmk7Ft27Y4fvz4rOdfUlISZWVlsW7durh06VKUlZUVvOaRI0fizJkzcezYsViyZEk8ePCgoPPk'+
				'v1GUzWYn3Ib5E6Mfv4kH/wUAAWA+8PRHAAABAAQABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEA'+
				'BAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAE'+
				'ABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAA'+
				'QAAAAQAEABAAQAAAAQAEABAAQAAAAQAEAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABA'+
				'AAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAFwC0AAAAEA'+
				'5pO/AfETrOu7R2hxAAAAAElFTkSuQmCC';			
		}
		return rtn;
	}
});