Ext.require(['Ext.data.*', 'Ext.grid.*']);

Ext.define('Person', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'codigo',type: 'int'},
        {name: 'nombre', type: 'string'},
        {name: 'apellidoPaterno',   type: 'string'},
        {name: 'apellidoMaterno',   type: 'string'},
    ],
});

Ext.onReady(function(){

    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'Person',
        proxy: {
            type: 'rest',
            url: '../postgres/methods/list.php',
            reader: {
                type: 'json',
                root: 'data'
            },
            writer: {
                type: 'json'
            }
        },
        listeners: {
            write: function(store, operation){
                var record = operation.getRecords()[0],
                    name = Ext.String.capitalize(operation.action),
                    verb;
                    
                    
                if (name == 'Destroy') {
                    record = operation.records[0];
                    verb = 'Destroyed';
                } else {
                    verb = name + 'd';
                }
                
            }
        }
    });
    
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
    let form = Ext.create('Ext.form.Panel', {
        title: 'Simple Form',
        bodyPadding: 5,
        width: 350,

        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
    
        defaultType: 'textfield',
        items: [{
            xtype:'numberfield',
            fieldLabel: 'codigo',
            name: 'codigo',
            allowBlank: false
        },{
            fieldLabel: 'nombre',
            name: 'nombre',
            allowBlank: false
        },{
            fieldLabel: 'Apellido Paterno',
            name: 'apellidoPaterno',
            //value: 'xd',
            allowBlank: false
        },{
            fieldLabel: 'Apellido Materno',
            name: 'apellidoMaterno',
            allowBlank: false
        },
        {
            xtype: 'toolbar',
            items: [{
                text: 'cancelar',
                iconCls: 'icon-add',
                handler: function(){
                    form.getForm().reset()
                    form.hide()
                    grid.show()
                }
            }, '-', {
                itemId: 'enviar',
                text: 'Enviar',
                iconCls: 'icon-Eniar',
                handler: function(){
                    var selection = form.getForm().getValues();
                    Ext.Ajax.request({
                        url:'../postgres/methods/create.php',
                        method: 'POST',
                        params: selection,
                        success: function(response){
                            if (typeof JSON.parse(response.responseText).ok !== 'undefined'){
                                var rec = new Person({
                                    'id': JSON.parse(response.responseText).id,
                                    'codigo':selection.codigo,
                                    'nombre': selection.nombre,
                                    'apellidoPaterno':selection.apellidoPaterno,
                                    'apellidoMaterno':selection.apellidoMaterno 
                                })
                                grid.store.add(rec)
                                alert(JSON.parse(response.responseText).ok)
                                form.getForm().reset()
                                form.hide()
                                grid.show()
                            }else if(typeof JSON.parse(response.responseText).error !== 'undefined'){
                                alert(JSON.parse(response.responseText).error)
                            }else{
                                alert('error')
                            }
                        }
                    })
                }
            }]
        }
    ],    
        renderTo: Ext.getBody()
    }).hide();


   




    var grid = Ext.create('Ext.grid.Panel', {
        extend: 'Ext.Window',
        renderTo: document.body,
        plugins: [rowEditing],
        width: 600,
        height: 400,
        frame: true,
        title: 'Trabajadores',
        //style: "color: #fff;background-color: #007bff;border-color: #007bff;",
        store: store,
        iconCls: 'icon-user',
        //items:[
        columns: [{
            text: 'Id',
            //width: 40,
            sortable: true,
            dataIndex: 'id'
        }, {
            text: 'Codigo',
            //width:80,
            flex:2,
            sortable: true,
            dataIndex: 'codigo',
            field: {
                xtype: 'textfield'
            }
        }, {
            header: 'Nombre',
            //width: 80,
            flex:2,
            sortable: true,
            dataIndex: 'nombre',
            field: {
                xtype: 'textfield'
            }
        }, {
            text: 'Apellido Paterno',
            flex:3,
            sortable: true,
            dataIndex: 'apellidoPaterno',
            field: {
                xtype: 'textfield'
            }
        },{
            text: 'Apellido Materno',
            //width: 80,
            flex:3,
            sortable: true,
            dataIndex: 'apellidoMaterno',
            field: {
                xtype: 'textfield'
            }
        },
        {
            text: 'eliminar',
            xtype: 'actioncolumn',
            sortable: true,
            flex:1,
            
            items:[{
                icon: '../icon/delete2.png',
                tooltip: 'Sell stock',
                handler: function(grid,rowIndex,colIndex){
                    let rec = store.getAt(rowIndex)
                    Ext.Ajax.request({
                        url:'../postgres/methods/delete.php',
                        method: 'POST',
                        params: {
                            'id': rec.get('id')
                        },
                        success: function(response){
                            if (typeof JSON.parse(response.responseText).ok !== 'undefined'){
                                store.remove(rec)
                                setTimeout(function(){
                                    alert(JSON.parse(response.responseText).ok)
                                }, 500);
                            }else if(typeof JSON.parse(response.responseText).error !== 'undefined'){
                                alert(JSON.parse(response.responseText).error)
                            }else{
                                alert('error')
                            }
                        }
                    })
                }
            }]
        },
        {
            text: 'agregar',
            xtype: 'actioncolumn',
            sortable: true,
            flex:1,
            items:[{
                xtype: 'button',
                icon: '../icon/update.png',
                tooltip: 'delete stock',
                handler: function(grid,rowIndex,colIndex){
                    let rec = store.getAt(rowIndex)
                    console.log(rec.get('id'))
                    Ext.Ajax.request({
                        url:'../postgres/methods/show.php',
                        method: 'GET',
                        params: {
                            'id': rec.get('id')
                        },
                        success: function(response){
                            if (typeof JSON.parse(response.responseText).ok !== 'undefined'  ||
                                typeof JSON.parse(response.responseText) !== 'undefined' &&
                                typeof JSON.parse(response.responseText).error == 'undefined'){
                                let dat = JSON.parse(response.responseText)
                                console.log(dat)
                                form2.getForm().findField('row').setValue(rowIndex)
                                form2.getForm().findField('id').setValue(dat.id)
                                form2.getForm().findField('codigo').setValue(dat.codigo)
                                form2.getForm().findField('nombre').setValue(dat.nombre)
                                form2.getForm().findField('apellidoPaterno').setValue(dat.apellidoPaterno)
                                form2.getForm().findField('apellidoMaterno').setValue(dat.apellidoMaterno)
                                
                                form2.show()
                            }else if(typeof JSON.parse(response.responseText).error !== 'undefined'){
                                alert(JSON.parse(response.responseText).error)
                            }else{
                                alert('error')
                            }
                        }
                    })
                    
                }
            }]
        }
    ],
        dockedItems: [{
            xtype: 'toolbar',
            aling: 'middle',
            items: [{
                text: 'añadir trabajador',
                iconCls: 'icon-add',
                handler: function(){
                    grid.hide();
                    form.show();
                    form2.hide();
                }
            }]
        }]

    /*new colum*/
    });
    grid.columns[0].setVisible(false)
    let form2 = Ext.create('Ext.form.Panel', {
        title: 'editar trabajador',
        bodyPadding: 5,
        width: 350,

        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
    
        defaultType: 'textfield',
        items: [
            {
                xtype:'hiddenfield',
                fieldLabel: 'row',
                name: 'row',
                allowBlank: false
        },
        {
                xtype:'hiddenfield',
                fieldLabel: 'id',
                name: 'id',
                allowBlank: false
        },{
            xtype:'numberfield',
            fieldLabel: 'codigo',
            name: 'codigo',
            allowBlank: false
        },{
            fieldLabel: 'nombre',
            name: 'nombre',
            allowBlank: false
        },{
            fieldLabel: 'Apellido Paterno',
            name: 'apellidoPaterno',
            //value: 'xd',
            allowBlank: false
        },{
            fieldLabel: 'Apellido Materno',
            name: 'apellidoMaterno',
            allowBlank: false
        },
        {
            xtype: 'toolbar',
            items: [{
                text: 'cancelar',
                iconCls: 'icon-add',
                handler: function(){
                    form2.hide()
                }
            }, '-', {
                itemId: 'enviar',
                text: 'Enviar',
                iconCls: 'icon-Eniar',
                handler: function(){
                    var selection = form2.getForm().getValues();
                    console.log(selection)
                    Ext.Ajax.request({
                        url:'../postgres/methods/update.php',
                        method: 'POST',
                        params: selection,
                        success: function(response){
                            if (typeof JSON.parse(response.responseText).ok !== 'undefined'){
                                var rec = new Person({
                                    'id': selection.id,
                                    'codigo':selection.codigo,
                                    'nombre': selection.nombre,
                                    'apellidoPaterno':selection.apellidoPaterno,
                                    'apellidoMaterno':selection.apellidoMaterno 
                                })
                                alert(JSON.parse(response.responseText).ok)
                                grid.store.getAt(selection.row).set(rec)
                                form2.hide()
                            }else if(typeof JSON.parse(response.responseText).error !== 'undefined'){
                                alert(JSON.parse(response.responseText).error)
                            }else{
                                alert('error')
                            }
                            
                        }
                    })
                }
            }]
        }
    ],    
        renderTo: Ext.getBody()
    }).hide();
});
