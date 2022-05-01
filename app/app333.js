Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.layout.container.Border',
]);

Ext.onReady(function(){
    Ext.define('Book',{
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type: 'int'},
            {name: 'ser',type: 'string'},
            {name: 'num', type: 'string'},
            {name: 'cliente',   type: 'string'},
            {name: 'monto',   type: 'float'},
            {name: 'detalles'}
        ],
    });


    var store = Ext.create('Ext.data.Store', {
        model: 'Book',
        proxy: {
            type: 'rest',
            url: '../postgres/methodsVenta/list.php',
            reader: {
                type: 'json',
                root: 'data'
            },
            writer: {
                type: 'json'
            }
        },
    });


    var grid = Ext.create('Ext.grid.Panel', {
        id: "gridlisr",
        store: store,
        
        columns: [
            {text: "id", flex:1,hidden:true, dataIndex: 'id', sortable: true},
            {text: "ser", flex: 1, dataIndex: 'ser', sortable: true},
            {text: "num", flex:1, dataIndex: 'num', sortable: true},
            {text: "cliente", flex:1, dataIndex: 'cliente', sortable: true},
            {text: "monto", flex:1, dataIndex: 'monto', sortable: true},
            {text: "detalles", flex:1,hidden:true, dataIndex: 'detalles',sortable:true}
        ],
        viewConfig: {
            forceFit: true
        },
        height:300,
        width:500,
        split: true,
        region: 'north'
    })
    
    var bookTplMarkup = [
        '<p>producto: {producto}</p>',    
        '<p>precio por unidad: {unidad}</p>',   
        '<p>cantidad: {cantidad}</p>',    
        '<p>total: {total}</p>',    
    ];
    let nookdef = [
        'selecciones una venta para ver los detalles',
    ]
    let defecbook = Ext.create('Ext.Template', nookdef)
    var bookTpl = Ext.create('Ext.Template', bookTplMarkup);

    let form = Ext.create('Ext.form.Panel', {
        title: 'editar venta',
        bodyPadding: 5,
        width: 350,
        height: '100%',
        region: 'south',

        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
    
        defaultType: 'textfield',
        items: [
        {
            xtype:'hiddenfield',
            fieldLabel: 'id',
            name: 'id',
            allowBlank: false
        },{
            xtype:'hiddenfield',
            fieldLabel: 'idDetails',
            name: 'idDetails',
            allowBlank: false
        },{
            fieldLabel: 'ser',
            name: 'ser',
            maxLength:5,
            allowBlank: false
        },{
            fieldLabel: 'num',
            name: 'num',
            allowBlank: false
        },{
            fieldLabel: 'cliente',
            name: 'cliente',
            allowBlank: false
        },{
            fieldLabel: 'producto',
            name: 'producto',
            allowBlank: false
        },{
            xtype: 'numberfield',
            fieldLabel: 'precio por unidad',
            name: 'precio',
            allowBlank: false
        },{
            xtype: 'numberfield',
            fieldLabel: 'cantidad',
            name: 'cantidad',
            allowBlank: false
        },{
            xtype: 'numberfield',
            fieldLabel: 'total',
            name: 'total',
            hidden:true
        },
        {
            xtype: 'toolbar',
            items: [{
                text: 'cancelar',
                iconCls: 'icon-add',
                handler: function(){
                    form.hide()
                    panelPrincipal.mostrarDetalles()
                }
            }, '-', {
                itemId: 'enviar',
                text: 'Enviar',
                iconCls: 'icon-Eniar',
                handler: function(){
                    var selection = form.getForm().getValues();
                    selection.total = (selection.precio * selection.cantidad)
                    Ext.Ajax.request({
                        url:'../postgres/methodsVenta/update.php',
                        method: 'POST',
                        params: selection,
                        success: function(response){
                            if (typeof JSON.parse(response.responseText).ok !== 'undefined'){
                                store.load();
                                alert(JSON.parse(response.responseText).ok)
                                form.hide()
                                let detailPanel = Ext.getCmp('detailPanel');
                                defecbook.overwrite(detailPanel.body);
                                panelPrincipal.mostrarDetalles()
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
    }).hide();

    let form2 = Ext.create('Ext.form.Panel', {
        title: 'crear venta',
        bodyPadding: 5,
        width: 350,
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
    
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'ser',
            name: 'ser',
            maxLength:5,
            allowBlank: false
        },{
            fieldLabel: 'num',
            name: 'num',
            allowBlank: false
        },{
            fieldLabel: 'cliente',
            name: 'cliente',
            allowBlank: false
        },{
            fieldLabel: 'producto',
            name: 'producto',
            allowBlank: false
        },{
            xtype: 'numberfield',
            fieldLabel: 'precio por unidad',
            name: 'precio',
            decimalPrecision:2,
            allowBlank: false
        },{
            xtype: 'numberfield',
            fieldLabel: 'cantidad',
            name: 'cantidad',
            decimalPrecision:2,
            allowBlank: false
        },{
            xtype: 'numberfield',
            fieldLabel: 'total',
            name: 'total',
            decimalPrecision:2,
            hidden:true
        },
        {
            xtype: 'toolbar',
            items: [{
                text: 'cancelar',
                iconCls: 'icon-add',
                handler: function(){
                    form2.getForm().reset()
                    form2.hide()
                    panelPrincipal.show()
                }
            }, '-', {
                itemId: 'enviar',
                text: 'Enviar',
                iconCls: 'icon-Eniar',
                handler: function(){
                    var selection = form2.getForm().getValues();
                    selection.total = (selection.precio * selection.cantidad)
                    console.log(selection)
                    Ext.Ajax.request({
                        url:'../postgres/methodsVenta/create.php',
                        method: 'POST',
                        params: selection,
                        success: function(response){
                            if (typeof JSON.parse(response.responseText).ok !== 'undefined'){
                                grid.store.load()
                                alert(JSON.parse(response.responseText).ok)
                                form2.getForm().reset()
                                form2.hide()
                                panelPrincipal.show()
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
    }).hide()



    var panelPrincipal = Ext.create('Ext.Panel', {
        renderTo: Ext.getBody(),
        frame: true,
        title: 'lista de ventas',
        width: '100%',
        height: 600,
        layout: 'border',
        ocultarDetalles: function(){
            var detailPanel = Ext.getCmp('detailPanel');
            detailPanel.hide()
            panelPrincipal.ocultarbotones()
        },
        mostrarDetalles: function(){
            var detailPanel = Ext.getCmp('detailPanel');
            detailPanel.show()
            panelPrincipal.mostrarbotones()
        },
        ocultarbotones: function(){
            var eliminar = Ext.getCmp('eliminarButton');
            var editar = Ext.getCmp('editarButton');
            eliminar.hide()
            editar.hide()
        },
        mostrarbotones: function(){
            var eliminar = Ext.getCmp('eliminarButton');
            var editar = Ext.getCmp('editarButton');
            eliminar.show()
            editar.show()
        },
        items: [
            grid,
            {
                region: 'center',
                items: [{
                    id: 'detailPanel',
                    height: 200,
                    bodyPadding: 7,
                    bodyStyle: "background: #ffffff;",
                    html: 'selecciones una venta para ver los detalles',
                },
                    {
                        xtype: 'button',
                        text: 'Eliminar',
                        id: 'eliminarButton',
                        region: 'west',
                        handler: function() {
                            var selec = grid.getSelectionModel().getSelection()[0]
                            let id = selec.data.detalles.id
                            
                            Ext.Ajax.request({
                                url:'../postgres/methodsVenta/delete.php',
                                method: 'POST',
                                params: {
                                    'id': id
                                },
                                success: function(response){
                                    if (typeof JSON.parse(response.responseText).ok !== 'undefined'){
                                        grid.store.remove(selec)
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
                     },{
                        xtype: 'button',
                        text: 'Editar',
                        id: 'editarButton',
                        handler: function() {
                            let selec = grid.getSelectionModel().getSelection()[0]
                            let id =  selec.data.id
                            console.log(id)
                           
                            Ext.Ajax.request({
                                url:'../postgres/methodsVenta/show.php',
                                method: 'GET',
                                params: {
                                    'id': id
                                },
                                success: function(response){
                                    if (typeof JSON.parse(response.responseText).ok !== 'undefined'  ||
                                        typeof JSON.parse(response.responseText) !== 'undefined' &&
                                        typeof JSON.parse(response.responseText).error == 'undefined'){
                                        let dat = JSON.parse(response.responseText)        
                                        form.getForm().findField('id').setValue(dat.id)
                                        form.getForm().findField('idDetails').setValue(dat.detalles.id)
                                        form.getForm().findField('ser').setValue(dat.ser)
                                        form.getForm().findField('num').setValue(dat.num)
                                        form.getForm().findField('cliente').setValue(dat.cliente)
                                        form.getForm().findField('producto').setValue(dat.detalles.producto)
                                        form.getForm().findField('precio').setValue(dat.detalles.unidad)
                                        form.getForm().findField('cantidad').setValue(dat.detalles.cantidad)
                                        form.getForm().findField('total').setValue(dat.monto)
                                        panelPrincipal.ocultarDetalles();
                                        form.show()
                                    }else if(typeof JSON.parse(response.responseText).error !== 'undefined'){
                                        alert(JSON.parse(response.responseText).error)
                                    }else{
                                        alert('error')
                                    }
                                }
                            })
                        }
                     }
                ]
        },form
    ],
    dockedItems: [{
        xtype: 'toolbar',
        items: [{
            text: 'crear',
            iconCls: 'icon-add',
            handler: function(){
                panelPrincipal.hide(); 
                form2.show();
            }
        }]
    }]
    });

    panelPrincipal.ocultarbotones()
    grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
        if (selectedRecord.length) {
            var detailPanel = Ext.getCmp('detailPanel');
            bookTpl.overwrite(detailPanel.body, selectedRecord[0].data.detalles);
            panelPrincipal.mostrarbotones()
        }
    });

    store.load();
});