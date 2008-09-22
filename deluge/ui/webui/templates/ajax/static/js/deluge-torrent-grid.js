/*
 * Script: deluge-torrent-grid.js
 *  The class for controlling the main torrent grid.
 *
 * Copyright:
 *   Damien Churchill (c) 2008
 */

Deluge.Widgets.TorrentGrid = new Class({
    Extends: Widgets.DataGrid,
    
    options: {
        columns: [
            {name: 'number',text: '#',type:'number',width: 20},
            {name: 'name',text: 'Name',type:'icon',width: 350},
            {name: 'size',text: 'Size',type:'bytes',width: 80},
            {name: 'progress',text: 'Progress',type:'progress',width: 180},
            {name: 'seeders',text: 'Seeders',type:'text',width: 80},
            {name: 'peers',text: 'Peers',type:'text',width: 80},
            {name: 'down',text: 'Down Speed',type:'speed',width: 100},
            {name: 'up',text: 'Up Speed',type:'speed',width: 100},
            {name: 'eta',text: 'ETA',type:'time',width: 80},
            {name: 'ratio',text: 'Ratio',type:'number',width: 60},
            {name: 'avail',text: 'Avail.',type:'number',width: 60}
        ]
    },
    
    icons: {
        'Downloading': '/pixmaps/downloading16.png',
        'Seeding': '/pixmaps/seeding16.png',
        'Queued': '/pixmaps/queued16.png',
        'Paused': '/pixmaps/inactive16.png',
        'Error': '/pixmaps/alert16.png',
        'Checking': '/pixmaps/inactive16.png'
    },
    
    get_selected_torrents: function() {
        var torrentIds = [];
        this.get_selected().each(function(row) {
            torrentIds.include(row.id);
        });
        return torrentIds;
    },
    
    set_torrent_filter: function(state) {
        state = state.replace(' ', '');
        this.filterer = function (r) {
            if (r.torrent.state == state) { return true } else { return false };
        };
        this.render();
    },
    
    update_torrents: function(torrents) {
        torrents.getKeys().each(function(torrentId) {
            var torrent = torrents[torrentId]
            var torrentIds = torrents.getKeys()
            if (torrent.queue == -1) {var queue = ''}
            else {var queue = torrent.queue + 1}
            var icon = this.icons[torrent.state]
            row = {
                id: torrentId,
                data: {
                    number: queue,
                    name: {text: torrent.name, icon: icon},
                    size: torrent.total_size,
                    progress: {percent: torrent.progress, text:torrent.state + ' ' + torrent.progress.toFixed(2) + '%'},
                    seeders: torrent.num_seeds + ' (' + torrent.total_seeds + ')',
                    peers: torrent.num_peers + ' (' + torrent.total_peers + ')',
                    down: torrent.download_payload_rate,
                    up: torrent.upload_payload_rate,
                    eta: torrent.eta,
                    ratio: torrent.ratio.toFixed(3),
                    avail: torrent.distributed_copies.toFixed(3)
                },
                torrent: torrent
            }
            if (this.has(row.id)) {
                this.updateRow(row, true)
            } else {
                this.addRow(row, true)
            }
            
            this.rows.each(function(row) {
                if (!torrentIds.contains(row.id)) {
                    row.element.destroy()
                    this.rows.erase(row.id)
                }
            }, this)
        }, this)
        this.render()
    }
});
