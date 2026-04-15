<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasUuids;

    protected $fillable = ['sale_id', 'ticket_code'];
    public $incrementing = false;
    protected $keyType = 'string';

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
